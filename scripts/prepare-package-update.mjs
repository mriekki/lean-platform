import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: options.capture === false ? 'inherit' : ['ignore', 'pipe', 'pipe']
  });
}

function git(root, args) {
  return run('git', ['-C', root, ...args], { cwd: root }).trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function parseSemver(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? '');
  if (!match) throw new Error(`Expected semantic version X.Y.Z, got: ${value ?? '<missing>'}`);
  return match.slice(1).map(Number);
}

export function assertVersionIncrease(current, next) {
  const a = parseSemver(current);
  const b = parseSemver(next);
  for (let i = 0; i < 3; i += 1) {
    if (b[i] > a[i]) return;
    if (b[i] < a[i]) break;
  }
  throw new Error(`Package version must increase: current ${current}, requested ${next}`);
}

function normalizeRemote(value) {
  return value.replace(/\\/g, '/').replace(/\.git$/i, '');
}

function assertExpectedOrigin(root, expectedRepository, label) {
  const origin = normalizeRemote(git(root, ['remote', 'get-url', 'origin']));
  const expected = expectedRepository.toLowerCase();
  if (!origin.toLowerCase().endsWith(`github.com/${expected}`) && !origin.toLowerCase().endsWith(`github.com:${expected}`)) {
    throw new Error(`${label} has unexpected origin: ${origin}`);
  }
}

function assertCleanTracked(root, label) {
  const status = git(root, ['status', '--porcelain', '--untracked-files=no']);
  if (status) throw new Error(`${label} has tracked working-tree changes`);
}

function assertExactAcceptedMain(root, expectedRepository, label) {
  const resolved = path.resolve(root);
  if (!fs.existsSync(resolved)) throw new Error(`${label} checkout not found: ${resolved}`);
  assertExpectedOrigin(resolved, expectedRepository, label);
  assertCleanTracked(resolved, label);
  run('git', ['-C', resolved, 'fetch', '--quiet', 'origin', 'main'], { cwd: resolved, capture: false });
  const head = git(resolved, ['rev-parse', 'HEAD']);
  const main = git(resolved, ['rev-parse', 'origin/main']);
  if (head !== main) throw new Error(`${label} is not exact origin/main: HEAD ${head}, origin/main ${main}`);
  return { root: resolved, commit: head };
}

function assertPlatformPreparationState(root) {
  assertExpectedOrigin(root, 'mriekki/lean-platform', 'Lean Platform checkout');
  assertCleanTracked(root, 'Lean Platform checkout');
  const branch = git(root, ['branch', '--show-current']);
  if (!branch || branch === 'main') {
    throw new Error('Refusing to modify Lean Platform main directly; create/switch to a release branch first');
  }
}

export function parseArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--version') values.version = argv[++i];
    else if (arg === '--core-root') values.coreRoot = argv[++i];
    else if (arg === '--deployment-root') values.deploymentRoot = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!values.version || !values.coreRoot || !values.deploymentRoot) {
    throw new Error('--version, --core-root, and --deployment-root are required');
  }
  parseSemver(values.version);
  return values;
}

export function preparePackageUpdate(args, root = ROOT) {
  const packageRoot = path.resolve(root);
  assertPlatformPreparationState(packageRoot);

  const packageFile = path.join(packageRoot, 'package.json');
  const lockFile = path.join(packageRoot, 'package-lock.json');
  const componentsFile = path.join(packageRoot, 'assets', 'components.json');

  const pkg = readJson(packageFile);
  const lock = readJson(lockFile);
  const components = readJson(componentsFile);

  if (pkg.name !== '@mriekki/lean' || components.package !== pkg.name) {
    throw new Error('Unexpected package identity');
  }
  if (pkg.version !== components.version || lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
    throw new Error('Existing package version metadata is inconsistent');
  }
  assertVersionIncrease(pkg.version, args.version);

  const core = assertExactAcceptedMain(args.coreRoot, 'mriekki/lean-agentic-core', 'Lean Agentic Core');
  const deployment = assertExactAcceptedMain(args.deploymentRoot, 'mriekki/lean-poc-deployment-kit', 'Lean POC Deployment Kit');

  const coreCompatibility = readJson(path.join(core.root, 'COMPATIBILITY.json'));
  const coreVersion = coreCompatibility.leanCoreVersion;
  parseSemver(coreVersion);

  const nextComponents = structuredClone(components);
  nextComponents.version = args.version;
  nextComponents.components.core.commit = core.commit;
  nextComponents.components.core.version = coreVersion;
  nextComponents.components.deployment.commit = deployment.commit;

  const nextPackage = structuredClone(pkg);
  nextPackage.version = args.version;

  const nextLock = structuredClone(lock);
  nextLock.version = args.version;
  nextLock.packages[''].version = args.version;

  // Complete every source-side validation/read before touching release metadata so
  // a missing descriptor cannot leave a partially prepared release branch.
  const descriptorUpdates = [];
  for (const [componentId, checkout] of Object.entries({ core, deployment })) {
    const component = nextComponents.components[componentId];
    const canonical = path.join(checkout.root, component.canonicalDescriptor);
    if (!fs.existsSync(canonical) || !fs.statSync(canonical).isFile()) {
      throw new Error(`Missing canonical descriptor for ${componentId}: ${canonical}`);
    }
    descriptorUpdates.push({
      destination: path.join(packageRoot, component.descriptor),
      content: fs.readFileSync(canonical, 'utf8')
    });
  }

  writeJson(packageFile, nextPackage);
  writeJson(lockFile, nextLock);
  writeJson(componentsFile, nextComponents);
  for (const update of descriptorUpdates) fs.writeFileSync(update.destination, update.content);

  return {
    package: nextPackage.name,
    fromVersion: pkg.version,
    version: args.version,
    core: { commit: core.commit, version: coreVersion },
    deployment: { commit: deployment.commit }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = preparePackageUpdate(parseArgs(process.argv.slice(2)));
    console.log(`Prepared ${result.package} ${result.fromVersion} -> ${result.version}`);
    console.log(`Core: ${result.core.version} ${result.core.commit}`);
    console.log(`Deployment Kit: ${result.deployment.commit}`);
  } catch (error) {
    console.error(`Package update preparation failed: ${error.message}`);
    process.exitCode = 2;
  }
}

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { componentEntries, resolveUnder, sha256File } from '../src/engine.mjs';
import { loadPackageData, readJson } from '../src/package-data.mjs';

function gitHead(root) {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch (error) {
    throw new Error(`Unable to resolve Git HEAD for ${root}: ${error.message}`);
  }
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  return value;
}

function sameJson(a, b) {
  return JSON.stringify(stableJson(a)) === JSON.stringify(stableJson(b));
}

function canonicalDescriptorPath(component, sourceRoot) {
  if (!component.canonicalDescriptor) throw new Error(`Component ${component.repository} is missing canonicalDescriptor metadata`);
  return resolveUnder(sourceRoot, component.canonicalDescriptor, 'canonical distribution descriptor');
}

export function assembleAssets(packageData, sourceRoots, outputRoot = path.join(packageData.root, 'assets', 'generated')) {
  const tempRoot = `${outputRoot}.tmp-${process.pid}`;
  fs.rmSync(tempRoot, { recursive: true, force: true });
  fs.mkdirSync(tempRoot, { recursive: true });
  const assembly = {
    schemaVersion: 1,
    package: packageData.pkg.name,
    version: packageData.pkg.version,
    components: {}
  };

  try {
    for (const [componentId, component] of Object.entries(packageData.assets.components)) {
      const sourceRoot = path.resolve(sourceRoots[componentId] ?? '');
      if (!sourceRoots[componentId] || !fs.existsSync(sourceRoot)) throw new Error(`Missing source checkout for component ${componentId}`);
      const actualCommit = gitHead(sourceRoot);
      if (actualCommit !== component.commit) throw new Error(`${componentId} checkout commit mismatch: expected ${component.commit}, got ${actualCommit}`);
      if (componentId === 'core') {
        const compatibility = readJson(path.join(sourceRoot, 'COMPATIBILITY.json'));
        if (compatibility.leanCoreVersion !== component.version) throw new Error(`Core version mismatch: expected ${component.version}, got ${compatibility.leanCoreVersion}`);
      }
      const packagedDescriptor = readJson(resolveUnder(packageData.root, component.descriptor, 'packaged descriptor'));
      const canonicalDescriptor = readJson(canonicalDescriptorPath(component, sourceRoot));
      if (!sameJson(packagedDescriptor, canonicalDescriptor)) throw new Error(`${componentId} distribution descriptor does not match the pinned source checkout`);

      const mappings = [];
      if (packagedDescriptor.profileSource && packagedDescriptor.profileDestination) mappings.push({ source: packagedDescriptor.profileSource, path: packagedDescriptor.profileDestination });
      for (const item of packagedDescriptor.mappings ?? []) mappings.push({ source: item.source, path: item.destination });
      if (!mappings.length) throw new Error(`${componentId} distribution has no mappings`);

      const files = [];
      for (const mapping of mappings) {
        const source = resolveUnder(sourceRoot, mapping.source, `${componentId} source`);
        if (!fs.existsSync(source) || !fs.statSync(source).isFile() || fs.lstatSync(source).isSymbolicLink()) {
          throw new Error(`Invalid ${componentId} source file: ${mapping.source}`);
        }
        const destination = resolveUnder(tempRoot, `${componentId}/${mapping.source}`, 'generated asset');
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(source, destination);
        files.push({ source: mapping.source, destination: mapping.path, sha256: sha256File(destination) });
      }
      assembly.components[componentId] = {
        repository: component.repository,
        commit: component.commit,
        ...(component.version ? { version: component.version } : {}),
        distribution: component.distribution,
        files
      };
    }

    fs.writeFileSync(path.join(tempRoot, 'ASSEMBLY.json'), JSON.stringify(assembly, null, 2) + '\n');
    fs.rmSync(outputRoot, { recursive: true, force: true });
    fs.renameSync(tempRoot, outputRoot);
    return assembly;
  } catch (error) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

function parse(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--core-root') values.core = argv[++i];
    else if (arg === '--deployment-root') values.deployment = argv[++i];
    else if (arg === '--output') values.output = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return values;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parse(process.argv.slice(2));
    const packageData = loadPackageData();
    const result = assembleAssets(packageData, { core: args.core, deployment: args.deployment }, args.output ? path.resolve(args.output) : undefined);
    console.log(`Assembled ${Object.values(result.components).reduce((sum, component) => sum + component.files.length, 0)} Lean asset files.`);
  } catch (error) {
    console.error(`Asset assembly failed: ${error.message}`);
    process.exitCode = 2;
  }
}

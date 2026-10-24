import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function evaluateAlignment(packageVersion, descriptor) {
  const publishedPackage = descriptor?.generation?.package;
  const contractVersion = descriptor?.generation?.packageVersion;

  if (publishedPackage !== '@mriekki/project-forge') {
    return {
      aligned: false,
      message: `PUBLIC CHATGPT CONTRACT ADVANCEMENT REQUIRED\nExpected generation.package @mriekki/project-forge, found ${publishedPackage ?? '<missing>'}`,
    };
  }

  if (contractVersion !== packageVersion) {
    return {
      aligned: false,
      message: `PUBLIC CHATGPT CONTRACT ADVANCEMENT REQUIRED\nPackage version: ${packageVersion}\nPublic contract package version: ${contractVersion ?? '<missing>'}`,
    };
  }

  return {
    aligned: true,
    message: `Public ChatGPT contract: ALIGNED (${packageVersion})`,
  };
}

export async function checkRepository(repositoryRoot = root) {
  const packageJson = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'));
  const descriptor = JSON.parse(await readFile(path.join(repositoryRoot, 'chatgpt/current.json'), 'utf8'));
  return evaluateAlignment(packageJson.version, descriptor);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await checkRepository();
  if (result.aligned) {
    console.log(result.message);
  } else {
    console.error(result.message);
    process.exitCode = 1;
  }
}

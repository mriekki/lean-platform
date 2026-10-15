#!/usr/bin/env node
import { run } from '../src/cli.mjs';

try {
  process.exitCode = await run();
} catch (error) {
  console.error(`Lean error: ${error.message}`);
  process.exitCode = 2;
}

#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const root = process.cwd();
const outDir = path.join(root, 'out');

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function run(cmd, args, env = {}, useShell = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: useShell,
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  // Use shell to avoid Windows spawn EINVAL issues
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  await run(npmCmd, ['run', 'build'], { NEXT_OUTPUT: 'export' }, true);
  const hasOut = await pathExists(outDir);
  if (!hasOut) {
    throw new Error('Static export directory "out" was not generated.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



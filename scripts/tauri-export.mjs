#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const root = process.cwd();
const outDir = path.join(root, 'out');
const appDir = path.join(root, 'src', 'app');
const apiDir = path.join(appDir, 'api');

function uniqueDisabledDirBase() {
  const base = path.join(appDir, '__api_disabled__');
  return base;
}

async function getAvailablePath(preferred) {
  if (!(await pathExists(preferred))) return preferred;
  const withTs = `${preferred}-${Date.now()}`;
  if (!(await pathExists(withTs))) return withTs;
  let i = 1;
  while (await pathExists(`${preferred}-${i}`)) i++;
  return `${preferred}-${i}`;
}

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
  // Temporarily move Next API routes out during static export to avoid dynamic-route error
  let disabledDir = null;
  if (await pathExists(apiDir)) {
    const target = await getAvailablePath(uniqueDisabledDirBase());
    await fs.rename(apiDir, target);
    disabledDir = target;
  }

  try {
    // Use shell to avoid Windows spawn EINVAL issues
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    await run(npmCmd, ['run', 'build'], { NEXT_OUTPUT: 'export', NEXT_TELEMETRY_DISABLED: '1' }, true);
    const hasOut = await pathExists(outDir);
    if (!hasOut) {
      throw new Error('Static export directory "out" was not generated.');
    }
  } finally {
    // Restore API directory
    if (disabledDir && (await pathExists(disabledDir))) {
      if (!(await pathExists(apiDir))) {
        await fs.rename(disabledDir, apiDir);
      } else {
        // fallback: keep disabledDir if apiDir somehow reappeared
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



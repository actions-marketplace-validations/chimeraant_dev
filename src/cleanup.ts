import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { execScript, nixCache, pnpmCache } from './util';

const restoreNixStore = async () => {
  if (nixCache.shouldSave()) {
    await execScript('export.sh', [nixCache.path]);
    await nixCache.save();
  }
};

const restorePnpmStore = async () => {
  if (pnpmCache.shouldSave()) {
    await exec.exec('pnpm store prune');
    await pnpmCache.save();
  }
};

const run = async () => {
  try {
    await Promise.all([restoreNixStore(), restorePnpmStore()]);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
};

run();

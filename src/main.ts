import * as core from '@actions/core';

import { execScript, getNixCache, getPnpmCache } from './util';

const setupNixCache = async () => {
  const nixCache = await getNixCache();
  const restoredCacheKey = await nixCache.restore();
  return [nixCache, restoredCacheKey] as const;
};

const setupNixDirenv = async () => {
  const [[nixCache, restoredCacheKey]] = await Promise.all([
    setupNixCache(),
    execScript('install.sh'),
  ]);

  if (restoredCacheKey !== undefined) {
    await execScript('import.sh', [nixCache.path]);
  }

  await execScript('direnv-setup.sh');
};

const run = async () => {
  try {
    // https://github.com/cachix/install-nix-action/blob/11f4ad19be46fd34c005a2864996d8f197fb51c6/install-nix.sh#L84-L85
    core.addPath('/nix/var/nix/profiles/default/bin');
    core.addPath(`/nix/var/nix/profiles/per-user/${process.env['USER']}/bin`);

    const pnpmCache = await getPnpmCache();
    await Promise.all([setupNixDirenv(), pnpmCache.restore()]);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
};

run();

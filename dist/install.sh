#!/usr/bin/env bash

set -euo pipefail

{

  INPUT_EXTRA_NIX_CONFIG= \
  INPUT_INSTALL_OPTIONS= \
  INPUT_INSTALL_URL= \
  INPUT_NIX_PATH= \
  GITHUB_PATH=/dev/null \
  bash <(curl -sfL https://raw.githubusercontent.com/cachix/install-nix-action/master/install-nix.sh)

  echo "::group::Installing direnv"
  nix-env -iA direnv -f 'channel:nixos-unstable'

  echo $(which direnv)

  LINE='eval "\$(direnv hook bash)"'
  FILE="$HOME/.profile"
  grep -qF -- "$LINE" "$FILE" || echo "$LINE" >> "$FILE"
  echo "::endgroup::"
}

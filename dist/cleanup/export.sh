#!/usr/bin/env bash

set -euo pipefail

echo "::group::Garbage collecting nix store"
# clear unused packages from restored cache.
# for example, new cache should be smaller if less package were used, 
# but will cache entire store from previous cache if it was not garbage collected
nix-store --gc
echo "::endgroup::"

echo "::group::Optimising nix store"
nix-store --optimise
echo "::endgroup::"

echo "::group::Exporting nix store to ${1}"
nix-store --export $(find /nix/store -maxdepth 1 -name '*-*') > "$1"
echo "::endgroup::"

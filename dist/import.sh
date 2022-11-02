#!/usr/bin/env bash

set -euo pipefail

echo "::group::Importing to Nix Store"
ls "$1" | wc -l
nix copy -s --no-check-sigs --from "$1"
echo "::endgroup::"

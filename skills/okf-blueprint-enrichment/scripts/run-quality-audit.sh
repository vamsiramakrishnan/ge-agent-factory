#!/usr/bin/env bash
set -euo pipefail
spec=${1:-}
if [[ -n "$spec" ]]; then
  ge okf quality audit --spec "$spec" --json
else
  ge okf quality audit --all --json
fi

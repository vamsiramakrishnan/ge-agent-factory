#!/usr/bin/env bash
set -euo pipefail
shard=${1:?usage: apply-shard.sh <shard.json>}
python3 - "$shard" <<'PY'
import json, subprocess, sys, pathlib
shard=json.load(open(sys.argv[1]))
patch_dir=pathlib.Path('.enrichment/patches'); patch_dir.mkdir(parents=True, exist_ok=True)
for spec in shard['specs']:
    patch=patch_dir / (spec['id'].replace('/','-') + '.patch.json')
    subprocess.check_call(['ge','okf','enrich','generate','--spec',spec['id'],'--out',str(patch)])
    subprocess.check_call(['ge','okf','enrich','apply','--patch',str(patch)])
PY

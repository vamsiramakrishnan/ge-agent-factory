#!/usr/bin/env bash
set -euo pipefail
shard=${1:?usage: verify-shard.sh <shard.json>}
python3 - "$shard" <<'PY'
import json, subprocess, sys
shard=json.load(open(sys.argv[1]))
for spec in shard['specs']:
    subprocess.check_call(['ge','okf','eval','verify','--spec',spec['id']])
    subprocess.check_call(['ge','okf','quality','audit','--spec',spec['id'],'--fail-under',str(shard.get('acceptance',{}).get('minScore',75))])
PY

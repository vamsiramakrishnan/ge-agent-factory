---
title: Troubleshooting
parent: Operations
nav_order: 4
layout: default
description: Failure modes we've actually hit, with causes and the exact fix — plus where to look first for any failed stage.
---

# Troubleshooting

Start here when a run fails: `ge agents logs <runId> --stage <stage>`
pretty-prints the persisted stage result (stderr, exit code, Cloud Build log
URL). The console equivalent is the Run Drawer's blocked reason and log
tail. For an environment-level verdict with runnable fixes, use `ge doctor`
(the console's [Readiness view](../console/readiness.html)).

## Failure modes we've actually hit

| Symptom | Cause | Fix |
|---|---|---|
| Container fails to start, `Cannot find module ./src/server/iap-jwt.js` | Dockerfile didn't copy a server module | ensure `Dockerfile` copies it; redeploy |
| `Missing required environment variable: GE_AGENT_FACTORY_WORKER_URL` | Cloud Run env not bound by Terraform | `ge infra apply` (Terraform owns env now; Cloud Build is builds-only) |
| 503 / `Memory limit exceeded` | gateway too small for in-process scaffolding | `ge deploy gateway` (8/32 default) |
| `Invalid IAP credentials: JWT 'email' claim isn't a string` | platform IAP on the service | `gcloud run services update <svc> --no-iap` (use the proxy) |
| stuck at `queued` | Cloud Tasks → worker failing | check worker IAP/`run.invoker`; `ge logs` |
| `pytest: file or directory not found: tests/test_smoke.py` | scaffolder didn't emit the smoke test | fixed in `factory from-usecase` |
| `Extra 'eval' is not defined` | missing `eval` extra in `pyproject.toml` | fixed in scaffolder |
| eval `extra_forbidden … metadata` / `string indices` | evalset not ADK-schema-conformant | fixed; contract metadata lives in `evals/golden.json` |
| `Legacy configuration detected in pyproject.toml` | no `agents-cli-manifest.yaml` | fixed; scaffolder emits the manifest |
| `npm ci … requires package-lock.json` | worker image used `npm ci`, repo is bun | worker Dockerfile uses `npm install` |

`ge logs <runId> --stage <stage>` pretty-prints the persisted stage result
(stderr, exit code, Cloud Build log URL) — start there for any failed stage.


## When the fix is a repair, not a config change

If the failure is in an agent's own validation/proof (rather than platform
wiring), use the repair loop instead of hand-editing:
[Repair a failed proof](../cookbooks/repair-failed-proof.html) — or
`ge fleet repair --ids <a,b>` directly.

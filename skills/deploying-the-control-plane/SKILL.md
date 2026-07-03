---
name: deploying-the-control-plane
description: Builds and deploys the factory's OWN apps — gateway (presentation deck), console, worker, MCP services — and runs the self-service installer into a target project. Use when deploying or updating the control-plane Cloud Run services, building app images, running ge infra apply / installer/build-and-deploy.sh, or wiring the Cloud Shell install. NOT for deploying generated agents (use running-release).
---

# Deploying The Control Plane

Use this skill to ship the factory itself (gateway/console/worker/MCP), not the agents it produces. This is the riskiest deploy surface — it changes the operator's own tools — so it is gated.

In plain language: each app has an app-local Dockerfile + sibling `cloudbuild.yaml`, built from the **repo-root** context; images are bound to Cloud Run via `ge infra apply` / the installer. The console is authenticated-only; reaching it needs `managing-access`.

## Assembly-Line Slot

- **First step:** confirm what changed and which service(s) need rebuilding; consult `guarding-the-factory` (outward-facing prod change).
- **Plays a role in:** building app images, binding Cloud Run revisions, and the Cloud Shell self-service install.
- **Input:** the repo at a known SHA, target project/region, and the build configs.
- **Output:** pushed images + updated/created Cloud Run services, verified Ready.
- **Next step:** `managing-access` to make a new service reachable; record the deploy.

## Workflow

1. Pick a TAG (git short sha). Guard the action (prod, outward-facing).
2. Build per app via Cloud Build from repo root (mirrors `installer/build-and-deploy.sh`):
   - Each app image needs the workspace to resolve: `packages/`, all app `package.json`s (for `--frozen-lockfile`), `tools/`, and the app's `src/server`. Server modules must not throw at import (vite bundles them at build).
3. Deploy: update existing services (preserves env/config) or create new ones with the right SA + env.
4. Verify revisions reach **Ready** (container boots) — a Ready revision proves runtime deps resolved.
5. Hand reachability/auth to `managing-access` (console is `--no-allow-unauthenticated`).

## Commands

```bash
TAG=$(git rev-parse --short HEAD)
# build (per app cloudbuild.yaml, repo-root context):
gcloud builds submit . --config apps/presentation/cloudbuild.yaml \
  --substitutions=_REGION=us-central1,_AR_REPO=cloud-run-source,_SERVICE_NAME=ge-agent-factory-gateway,_TAG=$TAG
gcloud builds submit . --config apps/console/cloudbuild.yaml \
  --substitutions=_REGION=us-central1,_AR_REPO=cloud-run-source,_SERVICE_NAME=ge-agent-factory-console,_TAG=$TAG
# bind (preferred): terraform owns Cloud Run config
bun tools/ge.mjs infra apply --gateway-image <AR>/ge-agent-factory-gateway:$TAG
# or the full installer (gateway+worker+console+terraform):
installer/build-and-deploy.sh
```

## Common mistakes

- Mirroring an old Dockerfile that predates a new dep (missing `packages/`/`tools/`/`src/server` → build fails).
- A server module that throws at module load (vite imports it at build → build fails); defer runtime-env checks to point of use.
- Deploying via raw `gcloud run` when terraform owns the config (causes drift) — prefer `ge infra apply` / the installer.

## Done when

The target services run the new image, revisions are Ready, and `managing-access` confirms reachability.

## References

- Read `references/example-session.md` before your first control-plane deploy (or when a revision won't go Ready) — a worked session (scope → guard → Cloud Build → terraform bind → Ready check → report), with the failed-revision variant and how to react without breaking serving traffic.
- Copy `assets/deploy-record.md` into the run record before starting — the scope/sign-off/tag/verify/rollback checklist a deploy must fill in.

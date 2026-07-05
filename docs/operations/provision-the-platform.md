---
title: Provision the platform
parent: Operations
nav_order: 1
layout: default
description: Stand up the factory, data, and tool planes in your own Google Cloud project, and drive them to a green readiness verdict.
---

# Provision the platform

**Scope:** cloud — creates and mutates resources in your Google Cloud project.

## Goal

Stand up the cloud planes the remote factory needs — the factory/runtime plane,
the data plane, and the tool (Model Context Protocol, MCP) plane — and drive
them to a green readiness verdict with the doctor. Or skip the plane-by-plane
path and run the guided self-service installer instead.

<p align="center">
  <img src="../assets/diagrams/three-planes.svg" alt="The ge CLI or console talks to the factory plane (Cloud Run gateway, Cloud Tasks queue, worker); the worker reaches the data plane (GCS, AlloyDB, Firestore, BigQuery, Bigtable) and the tool plane (Agent Gateway, per-department MCP services, Agent Registry)" width="700">
</p>

## Prerequisites

- `gcloud` installed and authenticated (`gcloud auth login`).
- A Gemini Enterprise app resource name:

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  ```

- `terraform` (installed by `mise run deps`) and `jq`.
- Local toolchain installed (`mise run setup`). See
  [Set up locally](../start/getting-started.html) if you haven't run this yet.

## Steps

### Path A — CLI, plane by plane

1. **Discover config and stand up the factory plane.**

   ```bash
   ge init        # writes .ge.json from discovered config
   ge up          # terraform apply → build → re-apply → init → doctor
   ```

   Or do all of toolchain + `ge init` + `ge up` in one shot:

   ```bash
   mise run bootstrap-cloud      # add CANARY=1 to also build one agent end-to-end
   ```

2. **Stand up the data plane** (GCS / BigQuery / AlloyDB / Bigtable / Firestore):

   ```bash
   ge data up
   ```

3. **Deploy the tool plane** (the per-department custom MCP services to Cloud Run):

   ```bash
   ge mcp deploy
   ```

4. **Drive to readiness with the doctor.**

   ```bash
   ge doctor                 # cloud preflight (APIs, IAM, IAP, memory, health)
   ge data doctor            # bucket, AlloyDB DSN secret, Bigtable, BigQuery
   ge mcp doctor             # MCP services + Agent Registry readiness
   ```

   Scope the main doctor to one plane or check a specific mutating command:

   ```bash
   ge doctor --data
   ge doctor --mcp
   ge doctor --command up         # also: data.up | mcp.deploy | agents.build | handoff
   ```

   `mise` task wrappers exist for each: `mise run up`, `mise run data`, `mise run mcp-deploy`,
   `mise run doctor`, `mise run data-doctor`, `mise run mcp-doctor`.

### Path B — self-service installer (Cloud Shell)

For a guided, turnkey install (see `installer/TUTORIAL.md`):

```bash
mise run setup                                  # local setup + skills + daemon
cd installer
cp values.example.tfvars values.tfvars      # fill project_id, project_number, gemini_enterprise_app_id
cd terraform && terraform init && terraform apply -var-file=../values.tfvars
cd .. && ./build-and-deploy.sh              # build + push real images, re-apply
./verify.sh                                 # POST /api/factory/preflight against the gateway
```

`build-and-deploy.sh` builds the gateway + worker images via Cloud Build,
re-applies Terraform with the real image SHAs, and writes
`apps/presentation/.env.local`. `verify.sh` runs the same structured checks the
UI uses.

## Verify

```bash
ge doctor          # all cloud sections green
ge data doctor     # data stores reachable
ge mcp doctor      # MCP services + Agent Registry ready
ge status          # planes show ✓ and a suggested next command
```

Installer path: `./installer/verify.sh` returns all checks passing.

> Re-running is safe: `ge up` and the installer steps are idempotent, so the
> fix-and-retry loop is always `ge doctor` → fix the failing check → re-run the
> same command.
{: .tip }

## Troubleshoot

- **`Set GEMINI_ENTERPRISE_APP_ID first`** — export it (or have a `.ge.json`)
  before `mise run bootstrap-cloud` / `ge up`.
- **`gcloud not found`** — install the Cloud SDK and `gcloud auth login`.
- **`Error 409: Already Exists` (Firestore)** — the project already has a default
  database; use a fresh project (Firestore can't be deleted in-place).
- **Adopt a hand-managed project into Terraform** — `ge cutover` (plan;
  `APPLY=1 mise run cutover` to apply).

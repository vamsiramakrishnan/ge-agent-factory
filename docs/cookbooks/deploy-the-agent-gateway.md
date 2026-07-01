---
title: Deploy the Agent Gateway
parent: Cookbooks
nav_order: 8
layout: default
---

# Deploy the Agent Gateway

## Goal

Provision the managed Agent Gateway that fronts the factory's MCP servers, then
apply the authz layer (extension + policy) and grant the agent runtime identity
egress — landing in audit (DRY_RUN) mode.

## Prerequisites

- The factory/tool plane already provisioned — see
  [Provision the platform](provision-the-platform.html). The gateway fronts
  the MCP servers that step deploys; it has nothing to front otherwise.
- `gcloud` authenticated; `terraform` installed.
- A project id (`PROJECT_ID` env or a gcloud default project).
- **The Agent Gateway is REGIONAL** — use a region (e.g. `us-central1`), never
  `global` (`global` returns HTTP 501). Gemini Enterprise `global`/`us` →
  gateway `us-central1`; `eu` → `europe-west1`.
- For egress enforcement later: register the MCP servers in the **Agent
  Registry** first (the directory of MCP servers/tools that the gateway and
  generated agents resolve by name — egress blocks unregistered hosts).

## Steps

1. **Plan, then provision the gateway** (idempotent — skips if it already exists):

   ```bash
   PROJECT_ID=<your-proj> ./installer/provision-agent-gateway.sh           # plan
   PROJECT_ID=<your-proj> ./installer/provision-agent-gateway.sh --apply   # create
   ```

   This runs a targeted `terraform apply` against `installer/terraform` (the
   official `terraform-google-agent-gateway` module), creating just the gateway +
   its API + IAM. Defaults: `LOCATION=us-central1`,
   `GATEWAY_NAME=ge-agent-factory-agw`.

2. **Apply the authz extension and policy** (the terraform module creates only the
   `agentGateways` resource; the authz layer is applied via gcloud from
   `installer/agent-gateway-authz/`):

   ```bash
   cd installer/agent-gateway-authz
   gcloud beta service-extensions authz-extensions import ge-agent-factory-iap-authz-ext \
     --source=iap-request-authz-extension.yaml --location=us-central1
   gcloud beta network-security authz-policies import ge-agent-factory-iap-authz-policy \
     --source=iap-request-authz-policy.yaml --location=us-central1
   ```

3. **Grant the agent runtime identity egress through IAP:**

   ```bash
   gcloud projects add-iam-policy-binding $PROJECT \
     --member="serviceAccount:$RUNNER" --role="roles/iap.egressor"
   ```

   The layer lands in **DRY_RUN (audit-only)**:
   `…-iap-authz-ext` (DRY_RUN) + `…-iap-authz-policy` (CUSTOM, targets the
   gateway) + `roles/iap.egressor` on the runner.

## Verify

```bash
# the gateway exists in the region:
gcloud beta network-services agent-gateways describe ge-agent-factory-agw \
  --location=us-central1 --project=$PROJECT_ID
```

Re-running `provision-agent-gateway.sh` should report
`✓ Agent Gateway '...' already provisioned — nothing to do.` Confirm the authz
extension and policy are imported, and the runner has `roles/iap.egressor`.

## To ENFORCE later (deliberate)

1. Populate `registries` with the MCP servers' Agent Registry entries (egress
   blocks unregistered hosts) and re-apply terraform.
2. Review the DRY_RUN decision logs.
3. Flip `iamEnforcementMode: "DRY_RUN"` → `"ENFORCED"` in
   `iap-request-authz-extension.yaml` and re-import. Verify a governed MCP call
   still succeeds; rollback = re-import with DRY_RUN.

## Troubleshoot

- **`Error 501: unimplemented`** — you used `location=global`. Agent Gateway is
  regional; use `us-central1` (or `europe-west1` for `eu`). If you've seen a
  Google-provided early-access/allowlist form for this feature elsewhere, it's
  for semantic-governance/Agent-Runtime features, *not* a prerequisite to
  create a gateway — the region fix alone resolves this error. See
  `installer/AGENT-GATEWAY.md` for the full story.
- **Governed MCP calls blocked after enforcement** — the target host isn't in
  `registries`. Register the MCP servers first; egress blocks unregistered hosts.
- **Registry mismatch** — Agent Runtime uses a *regional* registry, Gemini
  Enterprise the *global* one; a single gateway can't serve both. Match
  `registries` to the runtime.

See `installer/AGENT-GATEWAY.md` for the full rationale and config corrections.

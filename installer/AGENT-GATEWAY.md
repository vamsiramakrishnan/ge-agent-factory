# Managed Agent Gateway — setup

The Agent Gateway fronts the factory's MCP servers with governed, policy-enforced
access. Provisioned by `installer/terraform/agent_gateway.tf` (official
`terraform-google-agent-gateway` module, v0.5.0) + `installer/provision-agent-gateway.sh`.

## The 501 fix: use a REGION, not `global`

We first hit **`Error 501: unimplemented`** creating the gateway. The cause was **not**
preview enrollment — it was the `location`: Agent Gateway is **regional**, and we'd
used `global`. Switching to `us-central1` provisioned it cleanly (`ge-agent-factory-agw`
is live in `us-central1`). The access form
(`https://forms.gle/ZLNYKUDW7j2B4a8K7`) is for **semantic-governance / Agent-Runtime**
features, not a prerequisite to create a gateway.

Location mapping (Gemini Enterprise app → gateway region): `global`/`us` → `us-central1`,
`eu` → `europe-west1`. See the
[setup guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway).

## Config corrections applied (so provisioning is correct post-enrollment)

| What | Was | Now | Why |
|---|---|---|---|
| Location | `global` | `us-central1` | Agent Gateway is **regional**. Gemini Enterprise `global`/`us` → gateway `us-central1`; `eu` → `europe-west1`. |
| Access path | `CLIENT_TO_AGENT` | `AGENT_TO_ANYWHERE` | Our case is governing an agent's **egress** to MCP servers registered in Agent Registry (the doc's `protocols:[MCP]` egress example). `CLIENT_TO_AGENT` (ingress) is Agent-Runtime-only and omits registries. |
| Registries | always sent | sent only for `AGENT_TO_ANYWHERE` | Egress uses `registries`; ingress omits them. |
| APIs | networkservices + agentregistry | + networksecurity, compute, dns, modelarmor, aiplatform | Full set the setup guide requires. |

`registries` must point at the project's Agent Registry entries for the MCP servers
(`var.agent_gateway_registries`) — egress **blocks all outbound to unregistered
hosts**, so register the MCP servers/tools first.

## Authz layer — APPLIED (audit mode)

The terraform module creates the `agentGateways` resource only. The authz layer every
gateway requires is applied via gcloud from `installer/agent-gateway-authz/` and is
**live in DRY_RUN (audit-only)**:

```bash
cd installer/agent-gateway-authz
gcloud beta service-extensions authz-extensions import ge-agent-factory-iap-authz-ext \
  --source=iap-request-authz-extension.yaml --location=us-central1
gcloud beta network-security authz-policies import ge-agent-factory-iap-authz-policy \
  --source=iap-request-authz-policy.yaml --location=us-central1
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$RUNNER" --role="roles/iap.egressor"   # agent runtime identity
```

Current live state: `ge-agent-factory-agw` + `…-iap-authz-ext` (DRY_RUN) + `…-iap-authz-policy`
(CUSTOM, targets the gateway); `roles/iap.egressor` granted to `runner@`.

### To ENFORCE (deliberate, later) — single-var flip

The enforcement mode is codified as one Terraform variable,
`var.agent_gateway_authz_action` (default `DRY_RUN`). Terraform renders
`iap-request-authz-extension.yaml` from `…-extension.yaml.tftpl`, so the YAML's
`iamEnforcementMode` always matches the var — do NOT hand-edit the rendered YAML.

1. Populate `registries` with the MCP servers' Agent Registry entries (egress blocks
   unregistered hosts) and re-apply terraform.
2. Review the DRY_RUN decision logs.
3. Flip the var and re-render, then re-import the rendered YAML:
   ```bash
   cd installer/terraform
   terraform apply -var agent_gateway_authz_action=ENFORCED   # rewrites the YAML
   cd ../agent-gateway-authz
   gcloud beta service-extensions authz-extensions import ge-agent-factory-iap-authz-ext \
     --source=iap-request-authz-extension.yaml --location=us-central1
   ```
   Verify a governed MCP call still succeeds.
4. **Rollback:** `terraform apply -var agent_gateway_authz_action=DRY_RUN` then re-import
   the same way (or re-import the DRY_RUN YAML directly).

Registry type note: Agent Runtime uses a *regional* registry, Gemini Enterprise the
*global* one — a single gateway can't serve both. Match `registries` to the runtime.

## Provision

```bash
# After enrollment. Idempotent: skips if the gateway already exists.
PROJECT_ID=vital-octagon-19612 ./installer/provision-agent-gateway.sh           # plan
PROJECT_ID=vital-octagon-19612 ./installer/provision-agent-gateway.sh --apply   # create
```

Then run the authz-extension + authz-policy imports above, grant `roles/iap.egressor`
to the agent identities, and verify with a governed MCP call.

# Release Stages

These stages touch cloud resources or publishing surfaces.

## Stage Meanings

- `plan_deploy`: prepare deploy topology and required resources.
- `load_data`: load per-agent cloud data.
- `deploy_runtime`: deploy runtime service.
- `poll_runtime`: wait for runtime readiness.
- `register_tools`: register MCP/tool records.
- `publish_enterprise`: publish/register in Gemini Enterprise.
- `verify_live`: run live status/smoke verification.

## Rules

- Do not skip deploy plan.
- Do not claim publish success from plan artifact alone.
- Do not run local repair against remote-only state.
- For local builds, use `ge agents ship` to hand off post-boundary work.
- For remote builds, observe factory stage artifacts and run state.

## Proof Artifacts

- `artifacts/deploy-plan.json`
- `artifacts/publish-plan.json`
- `mock_data/cloud/load-report.json`
- `deployment_metadata.json`
- `agent_registry_registration.json`
- `gemini_enterprise_registration.json`
- `artifacts/live-verification-report.json`


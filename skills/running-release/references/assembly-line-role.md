# Assembly-Line Role

This skill owns the cloud/release end of the line.

## First Step

Confirm that local gates passed and release plans exist.

## Role In The Line

- `plan_deploy`: decide what cloud resources will be touched.
- `load_data`: place per-agent data in cloud stores.
- `deploy_runtime`: deploy the agent runtime.
- `poll_runtime`: wait until runtime is ready.
- `register_tools`: connect tools/MCP registry.
- `publish_enterprise`: register/publish in Gemini Enterprise.
- `verify_live`: prove the published agent is live.

## What Good Looks Like

The final output has cloud artifacts, registration artifacts, and live verification evidence. The user can see the state in CLI/console, and the Evidence Ledger can explain what was published and why it is considered ready.


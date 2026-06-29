---
name: running-release
description: Runs the release end of the GE Agent Factory line. Use when handling deploy plans, cloud data load, runtime deployment, runtime polling, tool registration, Gemini Enterprise publishing, live verification, or local-to-cloud handoff.
---

# Running Release

Use this skill after a workspace has passed the local build/gate boundary and needs cloud-side work.

In plain language: this skill owns the part of the line where mistakes are expensive because the factory starts touching cloud data, runtime deployment, tool registration, and Gemini Enterprise publishing. It should make handoff explicit and verify artifacts before pushing forward.

## Assembly-Line Slot

- **First step:** confirm the workspace passed the required gate and has deploy/publish plan artifacts.
- **Plays a role in:** `plan_deploy`, `load_data`, `deploy_runtime`, `poll_runtime`, `register_tools`, `publish_enterprise`, and `verify_live`.
- **Input:** mission, deploy plan, publish plan, local build artifacts, cloud config, and factory run state.
- **Output:** cloud data loaded, runtime deployed, tools registered, agent published, live verification evidence.
- **Next step:** record evidence and move to operations/monitoring or upstream fix if blocked.

## Workflow

1. Read mission mode and target.
2. Confirm deploy/publish plan artifacts exist.
3. For local builds, use explicit `ge agents ship`.
4. For remote builds, observe the cloud factory release stages.
5. Inspect stage artifacts before claiming success.
6. Record release facts through Evidence Ledger.

## Commands

Local handoff:

```bash
bun tools/ge.mjs agents ship --ids <workspace-id> --start-stage load_data --target-stage publish_enterprise
```

Deploy plan:

```bash
node apps/factory/src/cli.js deploy:plan <workspace-id>
```

Publish plan:

```bash
node apps/factory/src/cli.js publish:plan <workspace-id>
```

Summarize release artifacts:

```bash
node skills/running-release/scripts/summarize-release.mjs <workspace-dir>
```

## References

- Read `references/release-stages.md` before changing release flow.
- Read `references/assembly-line-role.md` to understand where this skill fits in the line.

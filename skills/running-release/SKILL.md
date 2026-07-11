---
name: running-release
description: Runs the release end of the GE Agent Factory line. Use when handling deploy plans, cloud data load, runtime deployment, runtime polling, tool registration, Gemini Enterprise publishing, live verification, or local-to-cloud handoff.
---

# Running Release

Use this skill after a workspace has passed the build/gate boundary and needs
cloud-side work. A generated remote run crosses that boundary at
`package_data`; a local or otherwise prebuilt workspace crosses it through an
explicit `ge handoff` that starts at `load_data`.

In plain language: this skill owns the part of the line where mistakes are expensive because the factory starts touching cloud data, runtime deployment, tool registration, and Gemini Enterprise publishing. It should make handoff explicit and verify artifacts before pushing forward.

## Assembly-Line Slot

- **First step:** confirm the workspace passed the required gate and its stable workspace archive contains the cloud data/tool package.
- **Plays a role in:** the `package_data` handoff contract, `plan_deploy`, `load_data`, `deploy_runtime`, `poll_runtime`, `register_tools`, `publish_enterprise`, and `verify_live`.
- **Input:** mission, deploy plan, publish plan, stable workspace archive, cloud config, and factory run state.
- **Output:** cloud data loaded, runtime deployed, tools registered, agent published, live verification evidence.
- **Next step:** record evidence and move to operations/monitoring or upstream fix if blocked.

## Workflow

1. Read mission mode, start stage, and target stage.
2. Confirm deploy/publish plans and the stable `workspace.tar.gz` exist.
3. Before `load_data`, inspect the archive for the load script, cloud data
   manifest, and MCP tool manifest. Do not skip `package_data` for a generated
   remote build.
4. For local/prebuilt builds, use explicit `ge handoff`; for generated remote
   builds, observe the cloud run beginning at `package_data`.
5. Watch the shared run ledger and inspect each stage result before claiming
   success. A preview or eval proves an agent can run; only `deploy_runtime`
   performs the real agents-cli runtime handoff.
6. If a runtime deploy partially creates an exact, verifiable resource, follow
   the operation-aware recovery in `triaging-runs` before retrying.
7. If `poll_runtime` fails on a transient Agent Runtime stream timeout, inspect
   `artifacts/deployed-smoke.json` and the per-attempt smoke logs. The shared
   runner retries transient transport/service failures but fails fast on IAM,
   configuration, and other deterministic errors.
8. Treat `artifacts/eval_case_workspaces` and `.google-agents-cli` as transient
   execution state. Durable release evidence is the traces, grade results,
   case logs, verdict, and stage result; do not carry eval sandboxes through
   every later workspace archive.
9. Record release facts through Evidence Ledger.

## Commands

Local handoff (defaults are already `--start-stage load_data --target-stage publish_enterprise`; then follow with `ge agents status --watch`):

```bash
bun tools/ge.mjs handoff agents-cli --ids <workspace-id>
```

Resume an interrupted cloud release from its exact failed stage:

```bash
bun tools/ge.mjs agents resume --remote --run --ids <use-case-id>
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

The supported agents-cli version is defined once in
`apps/factory/agents-cli-version.txt`. Run `mise run deps` to reconcile a local
install; builder and worker images read the same file.

## References

- Read `references/example-session.md` first if this is your first release — a worked session (readiness check → plans → explicit handoff → watch → artifact-verified verdict), with real output and the gate-blocked variant.
- Read `references/release-stages.md` before changing release flow.
- Read `../triaging-runs/references/remote-canary-failure-ladder.md` before debugging remote release-stage failures — it captures the builder image, Cloud Build YAML, IAM, and status-projection invariants.
- Read `references/assembly-line-role.md` to understand where this skill fits in the line.
- Copy `assets/release-target-example.json` for the `.ge.json` keys the release stages require (annotated; `ge handoff` refuses to start without project/bucket/geAppId).

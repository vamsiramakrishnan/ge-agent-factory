---
name: building-simulators
description: Builds, plans, materializes, calibrates, and validates GE mock data and enterprise source-system simulators. Use when a harness must generate scenario data, run Snowfakery, seed simulator overlays, profile and compare a real system read-only, model safe twin mutations, validate simulator conformance, or reason about systems/schemas/tools/workflows for generated agents.
---

# Building Simulators

Use this skill to create or improve the realistic source systems that generated agents use.

Core split:

```text
Skill = interview and orchestration
CLI = deterministic scaffolding/validation
Simulator pack = schema/tools/projection/materialization/workflows/seed/runtime contract
```

## Assembly-Line Slot

In plain language: this skill prepares realistic source systems for agents to use. The assembly line cannot build credible enterprise agents from vague mock data. It needs concrete schemas, tools, workflows, approval rules, state transitions, and seed data so generated agents can act like they are connected to real upstream systems.

- **First step:** create a mission plan for the scenario, then choose the source-system archetype if the graph needs simulator data.
- **Plays a role in:** source-system/data-plane preparation before and during `generate_data`, `package_data`, `load_data`, and MCP tool wiring.
- **Input:** system name, domain archetype, objects, workflows, realism level, and scale; optionally an OpenAPI spec, redaction policy, approved read-only probes, and samples from the real system.
- **Output:** simulator pack schema/tools/workflows/materialization, plus an optional redacted profile, replay corpus, realism report, and validated mutation model.
- **Next step:** validate simulator conformance through the mission graph. If the twin may route reads to a live target, hand the reviewed artifacts to `bringing-your-own` for binding and dispatch approval.

Use this skill when the question is “what does this enterprise system look like to an agent?” The result should be a simulator pack that gives the factory realistic data and tool behavior, not just static fixtures.

## Workflow

1. Confirm the spec scope: source systems, entities, documents, tools, eval evidence refs, and whether the job is a synthetic-only build or a real-system twin calibration.
2. Plan the scenario through `ge pipeline plan`; confirm the `mock.generate`, `snowfakery.generate`, `simulator.seed`, and `simulator.validate` nodes.
3. Scaffold and validate the deterministic twin before involving a real target.
4. For calibration, profile the OpenAPI spec offline and attach a redaction policy when PII-shaped fields are present. Review the read allowlist, write denylist, auth environment-variable reference, and policy hash before adding `--probe` or making any other network call.
5. Obtain explicit operator approval before live reads. Then use a small explicit `--max-calls` for `systems record` and `systems compare`, or import a prior HAR/NDJSON capture to stay offline. These commands never exercise write endpoints.
6. Infer write semantics from the reviewed OpenAPI spec or samples. Validate the current pack, review `systems mutation apply` in its default dry-run mode, persist only with `--write` after acceptance, and validate again. Investigate a base-hash mismatch instead of reaching first for `--force`.
7. Validate the updated simulator artifacts and realism gaps. Close only the gaps supported by evidence; latency and error-shape findings are advisory.
8. Hand off binding and dispatch to `bringing-your-own`. Binding writes local configuration and dispatch compiles a directive; neither calls the target, starts the tool plane, nor deploys it. Require a separate explicit approval before dialing or injecting live routing.
9. Report the evidence produced, remaining gaps, and exact next command.

For Antigravity-driven mock data and simulator seeding, read `references/mock-data-and-simulators.md` before acting.

## Minimal Interview

Collect these fields:

```json
{
  "systemId": "coupa",
  "displayName": "Coupa",
  "archetype": "procurement",
  "realism": "starter|enterprise|fortune_500",
  "objects": ["suppliers", "purchase_orders", "approvals"],
  "workflows": ["search", "approval", "state_transition", "role_gate", "audit", "integration_failures"],
  "scale": 10000
}
```

If the user only names a system, infer the archetype from `references/archetypes.md` and proceed with a starter pack. If ambiguous, ask one question that distinguishes the domain family.

## Commands

Plan the data/simulator graph:

```bash
bun tools/ge.mjs pipeline plan --scenario <usecase_id> --systems <system_ids> --target-stage preview --json
```

Run the data/simulator graph:

```bash
bun tools/ge.mjs daemon start
bun tools/ge.mjs pipeline run --scenario <usecase_id> --systems <system_ids> --target-stage preview
```

Inspect or resume:

```bash
bun tools/ge.mjs pipeline status <run_id> --json
bun tools/ge.mjs pipeline resume <run_id>
```

List available archetypes:

```bash
npm run generator:scaffold-simulator -- --list-archetypes true
```

Scaffold:

```bash
npm run generator:scaffold-simulator -- --id <system_id> --name "<Display Name>" --archetype <archetype> --realism <level>
```

Validate:

```bash
npm run generator:validate-simulators -- --system <system_id>
npm run generator:test-simulators
npm run generator:simulator-coverage
```

Download official API specs and integration docs:

```bash
npm run generator:download-openapi-specs
npm run generator:download-openapi-specs -- --system <system_id> --refresh true
```

Materialize after Snowfakery has produced row output:

```bash
npm run generator:materialize-simulators -- --dir <workspace>
```

Synthesize a pack's deterministic seed data directly (no cloud calls; Snowfakery tier when `snowfakery` is on PATH, in-process offline tier otherwise — identical `--system`/`--seed`/`--profile` inputs produce identical bytes within a tier):

```bash
bun tools/ge.mjs data synth --system <system_id> --json
bun tools/ge.mjs data synth --system <system_id> --seed 42 --profile realistic --edge-case-rate 0.06
```

Calibrate a twin from real-system evidence. The profile command below is offline because it omits `--probe`; recording and comparison cross the network only after explicit approval:

```bash
bun tools/ge.mjs systems profile <system_id> --openapi <spec.json> --base-url <https://api.example> --auth env:<TOKEN_ENV> --redact <policy.json>
bun tools/ge.mjs systems record <system_id> --profile <profile.json> --script <probes.json> --max-calls 25 --redact <policy.json>
bun tools/ge.mjs systems compare <system_id> --profile <profile.json> --max-calls 25
```

Model and validate writes in the twin. The first apply is a dry-run; `--write` is a separate, reviewed repository mutation:

```bash
bun tools/ge.mjs systems mutation infer <system_id> --from-openapi <spec.json>
bun tools/ge.mjs systems mutation validate --system <system_id>
bun tools/ge.mjs systems mutation apply --proposal <proposal.json>
bun tools/ge.mjs systems mutation apply --proposal <proposal.json> --write
bun tools/ge.mjs systems mutation validate --system <system_id>
```

After validation, `bringing-your-own` owns the local binding and dispatch review. Do not interpret either artifact as permission to dial the target or deploy a service.

## Failure Handling

- `profile requires a redaction policy`: attach a `ge.redaction-policy.v1`; do not suppress the PII guard.
- live record/compare refused or exceeded budget: confirm approval and use a smaller explicit `--max-calls`; never widen the profile's read allowlist just to make a probe pass.
- mutation proposal base hash changed: re-run inference against the current pack and review the new diff; avoid `--force` unless the divergence was independently reconciled.
- dispatch still routes to twin: this is the safe default, not a conformance failure; live routing is a separate BYO decision and approval.
- `projection collection missing from schema`: patch `projection.json` or `schema.json`.
- `materialization collection missing from schema`: patch `materialization.json` or `schema.json`.
- `workflow handler missing from tools.json`: add the matching tool or remove the workflow binding.
- `workflow handler collection missing from schema`: patch `workflows.json` or `schema.json`.
- `unknown allowed role`: align `workflowCatalog.toolHandlers[*].allowedRoles` with `registry.json.roles`.
- `tool missing handler`: add runtime handler or remove the tool from `tools.json`.
- `seed row missing primary key`: fix `seed.json` or materialization aliases.
- coverage unchanged: add aliases to `registry.json` or confirm source-system naming.

## Pack Expectations

Every scaffolded pack should include:

- `schema.json`: collections, primary keys, and fields.
- `tools.json`: read tools plus at least one `submit_<entity>_update` tool when the domain has mutable operational state.
- `projection.json`: scenario-graph kinds to simulator collections.
- `materialization.json`: Snowfakery/generated-row aliases and defaults.
- `workflows.json`: declarative role gates, lifecycle transitions, approval blockers, and audit behavior.
- `seed.json`: small deterministic starter state; large data still comes from scenario graph plus Snowfakery materialization.

Before writing custom handlers, check `apps/factory/simulator-systems/openapi-sources.json` and the cached files under `apps/factory/simulator-systems/_openapi/<system_id>/`. If a machine-readable spec exists, derive tool names, input schemas, lifecycle verbs, and error shapes from the spec. If only docs are cached, use them as provenance and record which endpoints need manual capture or authenticated export.

Prefer generic workflow primitives first. Add custom Python handlers only when a system needs domain-specific side effects such as Workday business process creation, ServiceNow change gates, ledger balancing, or identity entitlement inheritance.

## Scenario Pack Interlock

`apps/factory/scripts/factory/packs/*` is the scenario fixture/eval enrichment layer. Simulator packs are the runtime MCP system layer. Keep them interlocked:

```text
scenario graph -> factory scenario packs -> Snowfakery rows -> simulator materialization -> MCP simulator runtime
```

Every active scenario pack should declare `simulatorInterop`:

```js
simulatorInterop: {
  archetypes: ["procurement", "supply_chain"],
  collections: ["suppliers", "purchase_orders", "approvals"],
  materializes: "what rows this pack contributes to simulator seed overlays"
}
```

When a scenario pack matches, `factory` annotates the behavior contract with `simulatorEnrichment.packBridges`. Use that to explain downstream materialization and to detect drift between fixture recipes and simulator schemas.

Run pack coverage when changing either layer:

```bash
bun run apps/factory/scripts/factory.mjs pack-coverage --out apps/factory/artifacts/pack-coverage.json
```

Check `simulatorInterop.unbridgedScenarioPackCounts`; active scenario packs should not be unbridged unless they are intentionally taxonomy-only.

## References

- Read `references/example-session.md` first if this is your first simulator build — a worked session (plan → archetype → scaffold → validate → report), with real output and the conformance-failure variant.
- Copy `assets/decision-record-example.json` as the starting downstream handoff record; its shape is defined by `references/decision-record.schema.json`.
- For where this skill fits in the Agent Factory assembly line, read `references/assembly-line-role.md`.
- For the Antigravity mock-data and simulator workflow, read `references/mock-data-and-simulators.md`.
- For archetype selection and starter objects, read `references/archetypes.md`.
- For the downstream handoff record, read `references/decision-record.schema.json`.
- For the mission data node inventory, load `planning-missions` and read its mission node reference.
- Engine: seed realization (`ge data synth`) runs on `@ge/synthkit` (`packages/synthkit/README.md`) — read it when tuning determinism, recipes, or the statistical realism tier.
- Docs: `docs/reference/synthetic-data.md` (the deep dive on pack contract → recipe → rows → seed.json), `docs/reference/simulator-systems.md`.

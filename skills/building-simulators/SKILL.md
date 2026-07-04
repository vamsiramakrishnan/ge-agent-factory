---
name: building-simulators
description: Builds, plans, materializes, and validates GE mock data and enterprise source-system simulators. Use when Antigravity or another harness must generate scenario data, run Snowfakery, seed simulator overlays, validate simulator conformance, or reason about systems/schemas/tools/workflows for generated agents.
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
- **Input:** system name, domain archetype, objects, workflows, realism level, and scale.
- **Output:** simulator pack schema/tools/workflows/materialization that generated agents can call through MCP.
- **Next step:** validate simulator conformance through the mission graph, then let workspace gates verify tools and behavior.

Use this skill when the question is “what does this enterprise system look like to an agent?” The result should be a simulator pack that gives the factory realistic data and tool behavior, not just static fixtures.

## Workflow

1. Confirm the spec scope: source systems, entities, documents, tools, and eval evidence refs.
2. Plan the scenario through `ge pipeline plan`.
3. Confirm the data nodes: `mock.generate`, `snowfakery.generate`, `simulator.seed`, `simulator.validate`.
4. Ask only the next missing question.
5. Invoke deterministic CLI commands for the current node.
6. Validate artifacts before moving to the next node.
7. Report remaining gaps and next commands.

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
npm run generator:new-simulator -- --list-archetypes true
```

Scaffold:

```bash
npm run generator:new-simulator -- --id <system_id> --name "<Display Name>" --archetype <archetype> --realism <level>
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

## Failure Handling

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

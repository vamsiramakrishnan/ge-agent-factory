# Mission Node Kinds

Use mission nodes as the durable control-plane units. Each node has a runtime kind, explicit inputs, expected artifacts, and a resume plan.

## Core Nodes

| Node | Runtime Kind | Purpose | Key Inputs | Expected Artifacts |
| --- | --- | --- | --- | --- |
| `preflight.doctor` | `doctor` | Check local/cloud readiness before work starts | `scope`, `command` | doctor report and readiness failures |
| `antigravity.spec-data-review` | `harness.run` | Run Antigravity over spec, eval, mock-data, simulator, and ADK eval contracts before data generation | `workspaceDir`, `agent`, `stage`, `message`, `model`, `location` | streamed harness events, harness journal, readiness report text |
| `mock.generate` | `mock.generate` | Build scenario graph, data plan, Snowfakery recipe, and simulator index | `scenario`, `workspace`, `sourceMap` | `mock_data/plan/data-plan.json`, `mock_data/scenario/scenario-graph.json`, `mock_data/snowfakery/structured.recipe.yml`, `mock_data/simulators/index.json` |
| `snowfakery.generate` | `snowfakery.generate` | Generate structured row output from the recipe | `recipe`, `output` | `mock_data/snowfakery/output`, `mock_data/snowfakery/realization-plan.json` |
| `simulator.seed` | `simulator.seed` | Materialize generated rows into simulator seed overlays | `workspace`, `input`, `index`, `report` | `mock_data/simulators/materialization-report.json`, simulator seed overlay files |
| `simulator.validate` | `simulator.validate` | Validate simulator schema/tool/workflow conformance | `systems`, `workspace` | conformance output and simulator registry coverage |
| `factory.build` | `ge.command` | Build selected agent workspaces through local or remote factory | `argv`, `command.id` | workspace artifacts, factory run JSON |
| `autopilot.converge` | `autopilot.run` | Run workspace gate, repair loop, and resumable convergence | `ids`, `targetStage`, `repair`, `attempts` | gate results, blockers, repaired workspace state |

## Default Commands

Plan only:

```bash
bun tools/ge.mjs mission plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
```

Run with runtime daemon:

```bash
bun tools/ge.mjs daemon start
bun tools/ge.mjs mission run --scenario <usecase_id> --ids <agent_ids> --target-stage preview
```

Run and schedule factory build too:

```bash
bun tools/ge.mjs mission run --scenario <usecase_id> --ids <agent_ids> --target-stage preview --with-factory
```

Run without Antigravity only for deterministic debugging:

```bash
bun tools/ge.mjs mission run --scenario <usecase_id> --ids <agent_ids> --target-stage preview --no-antigravity
```

Resume and observe:

```bash
bun tools/ge.mjs mission status <mission_task_id> --json
bun tools/ge.mjs mission resume <mission_task_id>
bun tools/ge.mjs runtime events <mission_task_id> --follow
```

## Change Rule

When adding a node kind, update the runtime adapter, artifact list, CLI status rendering, and tests together:

- `tools/lib/mission-nodes.mjs`
- `tools/lib/mission-node-registry.mjs`
- `tools/lib/mission-plan.mjs`
- `tools/lib/runtime-daemon.mjs`
- `tools/ge.mjs`
- matching `*.test.mjs`

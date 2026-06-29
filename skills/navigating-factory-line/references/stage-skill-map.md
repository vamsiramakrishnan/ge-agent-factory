# Stage Skill Map

This map is anchored to `apps/presentation/public/architecture/agent-factory-assembly-line.html` and `apps/factory/src/factory-orchestration.js`.

| Station | What It Means | Primary Skill | First Command Or Action | Next Step |
| --- | --- | --- | --- | --- |
| user_interview | Turn a rough idea into a usable use-case brief | `interviewing-specs` | ask only missing questions | create or select spec |
| spec_generation | Produce/validate source spec | `interviewing-specs` | create from freeform or select catalog use case | mission planning |
| mission | Decide Factory, data, simulator, Autopilot, and resume ownership | `planning-missions` | `bun tools/ge.mjs mission plan --scenario <usecase_id> --ids <agent_ids> --json` | factory plan, data nodes, or Autopilot |
| plan | Create factory work items | `running-factory` | read mission graph, then create factory plan if needed | factory run |
| generate_workspace | Generate ADK workspace | `running-factory` | run factory to workspace target | generate data |
| generate_data | Generate mock data from spec | `building-simulators` + `running-factory` | run mission `mock.generate` and `snowfakery.generate` nodes | package data |
| package_data | Package fixtures/cloud data/tools | `building-simulators` + `running-factory` | run mission `simulator.seed` and `simulator.validate` nodes | harness refine |
| harness_refine | Let harness review/refine generated code | `running-factory` | run harness review/refine | validate |
| validate | Run validation and spec-code trace | `checking-workspaces` | validate workspace | preview |
| preview | Run local preview/smoke | `checking-workspaces` | preview workspace | promote or repair |
| promote | Build promotion packet | `checking-workspaces` | create promotion packet | deploy plan |
| plan_deploy | Create deploy plan/topology | `running-release` | create deploy plan | load data or ship |
| load_data | Load per-agent cloud data | `running-release` | ship local build or observe cloud stage | deploy runtime |
| deploy_runtime | Deploy Agent Runtime/Cloud Run | `running-release` | observe cloud deploy stage | poll runtime |
| poll_runtime | Wait for runtime readiness | `running-release` | observe runtime readiness | register tools |
| register_tools | Register MCP/tool records | `running-release` | observe/register tools | publish |
| publish_enterprise | Publish/register in Gemini Enterprise | `running-release` | create publish plan or observe cloud publish | verify live |
| verify_live | Live smoke/status verification | `running-release` | observe live verification | evidence and operations |
| console_operation | User-visible control surface | `operating-console` | use console UI or `/api/ge/*` | run/observe selected station |
| evidence_learning | Normalize facts and repeated blockers | `recording-evidence` | validate/emit ledger event | upstream fix |

## Coverage Rule

Every station should have:

- a primary skill
- a first command or action
- a proof artifact or structured output
- a clear next station

If any of these is missing, the harness should stop and improve the skill map before automating more work.

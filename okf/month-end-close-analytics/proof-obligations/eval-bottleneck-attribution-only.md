---
type: Proof Obligation
title: "Golden eval obligation — Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?"
description: golden eval proof obligation
source_id: "eval-bottleneck-attribution-only"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [bottleneck-attribution-only](/tests/bottleneck-attribution-only.md)


## Mechanisms

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_blackline_task_dependencies](/tools/query-blackline-task-dependencies.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)

## Entities that must be referenced

- close_tasks
- task_dependencies

## Forbidden behaviors

- do not call action_looker_publish_dashboard without explicit request

# Citations

- [close-cycle-playbook](/documents/close-cycle-playbook.md)

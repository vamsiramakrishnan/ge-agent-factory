---
type: Proof Obligation
title: "Golden eval obligation — Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?"
description: golden eval proof obligation
source_id: "eval-full-month-end-retrospective"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [full-month-end-retrospective](/tests/full-month-end-retrospective.md)


## Mechanisms

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_blackline_task_dependencies](/tools/query-blackline-task-dependencies.md)
- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)
- [query_bigquery_benchmark_metrics](/tools/query-bigquery-benchmark-metrics.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)
- [evidence_close_acceleration_sop](/tools/evidence-close-acceleration-sop.md)
- [action_looker_publish_dashboard](/tools/action-looker-publish-dashboard.md)
- [action_email_distribute_retrospective](/tools/action-email-distribute-retrospective.md)

## Entities that must be referenced

- close_tasks
- task_dependencies
- close_cycles
- retrospective_reports

## Forbidden behaviors

- do not invent task durations or cycle times
- do not recommend owner reassignment without explicit controller approval

# Citations

- [close-cycle-playbook](/documents/close-cycle-playbook.md)
- [close-acceleration-sop](/documents/close-acceleration-sop.md)

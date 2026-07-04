---
type: Eval Scenario
title: Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 ...
description: "Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?"
source_id: "full-month-end-retrospective"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?

## Validates

- [close-metrics-aggregation](/queries/close-metrics-aggregation.md)

## Mechanisms to call

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_blackline_task_dependencies](/tools/query-blackline-task-dependencies.md)
- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)
- [query_bigquery_benchmark_metrics](/tools/query-bigquery-benchmark-metrics.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)
- [evidence_close_acceleration_sop](/tools/evidence-close-acceleration-sop.md)
- [action_looker_publish_dashboard](/tools/action-looker-publish-dashboard.md)
- [action_email_distribute_retrospective](/tools/action-email-distribute-retrospective.md)

## Success rubric

Retrospective report published to Looker and distributed to controllers with bottleneck analysis, trend vs target, and improvement recommendations.

# Citations

- [Close Cycle Playbook](/documents/close-cycle-playbook.md)
- [Close Acceleration SOP](/documents/close-acceleration-sop.md)

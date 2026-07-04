---
type: Eval Scenario
title: "Which close tasks took longer than planned in April 2026, and how much did th..."
description: "Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?"
source_id: "bottleneck-attribution-only"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?

## Validates

- [close-metrics-aggregation](/queries/close-metrics-aggregation.md)

## Mechanisms to call

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_blackline_task_dependencies](/tools/query-blackline-task-dependencies.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)

## Success rubric

Task-level bottleneck analysis with actual vs planned duration comparison; no action output.

# Citations

- [Close Cycle Playbook](/documents/close-cycle-playbook.md)

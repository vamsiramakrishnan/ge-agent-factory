---
type: Agent Tool
title: query_blackline_task_dependencies
description: "Resolve task dependency chains to identify critical path and wait-time contributors in the close cycle."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_blackline_task_dependencies

Resolve task dependency chains to identify critical path and wait-time contributors in the close cycle.

- **Kind:** query
- **Source system:** [BlackLine](/systems/blackline.md)

## Inputs

- cycle_id

## Outputs

- dependency_graph
- wait_time_analysis

## Side Effects

- May change BlackLine state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_blackline_task_dependencies](/policies/confirmation-query-blackline-task-dependencies.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [close_metrics_aggregation](/workflow/close-metrics-aggregation.md)
- [bottleneck_trend_analysis](/workflow/bottleneck-trend-analysis.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)
- [Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?](/tests/bottleneck-attribution-only.md)

## Evidence emitted

- source_system_record

## Required inputs

- cycle_id

## Produces

- dependency_graph
- wait_time_analysis

# Examples

```
query_blackline_task_dependencies(cycle_id=<cycle_id>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — query_blackline_task_dependencies](/policies/confirmation-query-blackline-task-dependencies.md)

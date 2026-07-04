---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Work Order Backlog Triage Orchestrator workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Work Order Backlog Triage Orchestrator workflow.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- lookup_key
- date_range

## Outputs

- analytics_events_records
- analytics_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [criticality_failure_history_scoring](/workflow/criticality-failure-history-scoring.md)
- [parts_crew_feasibility_check](/workflow/parts-crew-feasibility-check.md)
- [weekly_schedule_proposal_audit_publish](/workflow/weekly-schedule-proposal-audit-publish.md)

## Evals

- [Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/work-order-backlog-triage-orchestrator-end-to-end.md)
- [Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule.](/tests/work-order-backlog-triage-orchestrator-stale-baseline-aging-parts.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- analytics_events_records
- analytics_events_summary

# Examples

```
query_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)

---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Fiber Build Permitting Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Fiber Build Permitting Agent workflow.

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

- [jurisdiction_sla_aging_baseline_comparison](/workflow/jurisdiction-sla-aging-baseline-comparison.md)

## Evals

- [Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-build-permitting-agent-end-to-end.md)
- [Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves.](/tests/fiber-build-permitting-agent-sla-aging-reconciliation.md)

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

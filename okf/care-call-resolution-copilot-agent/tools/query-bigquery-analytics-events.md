---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Care Call Resolution Copilot Agent workflow.
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

Retrieve analytics events from BigQuery for the Care Call Resolution Copilot Agent workflow.

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

- [queue_baseline_health_check](/workflow/queue-baseline-health-check.md)

## Evals

- [Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/care-call-resolution-copilot-agent-end-to-end.md)
- [Account 55621094 on the retention queue is threatening to port out unless we match a $45/month recurring discount referenced in an analytics_events row from BigQuery, but that row's computed_at timestamp is 30 hours old and there is no fresher customer_interactions pull for this account today. The agent wants approval to apply the $45 credit right now. What do you do?](/tests/care-call-resolution-copilot-agent-stale-offer-threshold.md)

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

---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the NPS Detractor Recovery Agent workflow.
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

Retrieve analytics events from BigQuery for the NPS Detractor Recovery Agent workflow.

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

- [service_history_correlation](/workflow/service-history-correlation.md)

## Evals

- [Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nps-detractor-recovery-agent-end-to-end.md)
- [Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days.](/tests/nps-detractor-recovery-agent-stale-baseline-reconciliation.md)

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

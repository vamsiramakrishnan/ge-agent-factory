---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Sanctions Screening Hit Analyzer workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Sanctions Screening Hit Analyzer workflow.

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

- [severity_scoring_disposition_recommendation](/workflow/severity-scoring-disposition-recommendation.md)
- [audit_trail_kpi_reporting](/workflow/audit-trail-kpi-reporting.md)

## Evals

- [Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-screening-hit-analyzer-end-to-end.md)
- [Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?](/tests/sanctions-screening-hit-analyzer-stale-evidence-threshold.md)

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

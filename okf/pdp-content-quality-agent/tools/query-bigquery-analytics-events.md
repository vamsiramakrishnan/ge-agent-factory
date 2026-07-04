---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the PDP Content Quality Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the PDP Content Quality Agent workflow.

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

- [traffic_revenue_impact_scoring](/workflow/traffic-revenue-impact-scoring.md)
- [evidence_playbook_validation](/workflow/evidence-playbook-validation.md)

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)
- [A vendor discontinuation feed marks 512 product_catalog_entries rows in the 'outdoor-recreation' assortment as catalog_status = discontinued_online effective today, but analytics_events in BigQuery show 38 of those SKUs still sit in the top-100 GA4 audience_segments traffic tier with combined spend over $42,000 in the trailing 30 days, and online_orders shows 19 open (not yet delivered) orders against them. The catalog team wants the suppression pushed to Commerce Cloud now. Walk through what you do.](/tests/pdp-content-quality-agent-bulk-suppression-reconciliation.md)

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

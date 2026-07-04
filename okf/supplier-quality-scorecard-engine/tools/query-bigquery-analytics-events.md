---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Supplier Quality Scorecard Engine workflow.
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

Retrieve analytics events from BigQuery for the Supplier Quality Scorecard Engine workflow.

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

- [ppm_capa_trend_compute](/workflow/ppm-capa-trend-compute.md)

## Evals

- [Run the Supplier Quality Scorecard Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-quality-scorecard-engine-end-to-end.md)
- [Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 2026-06-18 for a dimensional nonconformance (NC #612044, severity: major), but the BigQuery historical_metrics baseline used for that vendor's PPM was last computed on 2026-05-20 (46 days ago). Finalize this vendor's Q2 risk scorecard and publish it to SAP S/4HANA QM.](/tests/supplier-quality-scorecard-engine-stale-evidence-reconciliation.md)

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

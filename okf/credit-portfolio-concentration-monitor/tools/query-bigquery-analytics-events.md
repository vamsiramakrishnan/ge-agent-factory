---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Credit Portfolio Concentration Monitor workflow.
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

Retrieve analytics events from BigQuery for the Credit Portfolio Concentration Monitor workflow.

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

- [concentration_limit_testing](/workflow/concentration-limit-testing.md)

## Evals

- [Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/credit-portfolio-concentration-monitor-end-to-end.md)
- [Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logistics Partners LLC. credit_memos records show the same obligor group already carries $2.1M outstanding under memo #812044, and covenant_records shows covenant 614532 (minimum_dscr) reported breached on 2026-05-28, still not cured or waived as of today, 2026-07-04. Determine whether booking the new application would push aggregate obligor-group exposure past the $10,000,000 house limit, and separately assess whether the uncured covenant breach independently requires escalation.](/tests/credit-portfolio-concentration-monitor-obligor-aggregation-edge.md)
- [The Looker dashboard shows CRE sector concentration at 71% of the board limit as of this morning, but the underlying BigQuery historical_metrics/analytics_events refresh is timestamped 2026-06-30 (four days stale) while three new CRE loan_applications were booked in nCino since then. Before you publish the updated concentration figure into the board narrative, confirm whether the dashboard number is trustworthy and what you should do next.](/tests/credit-portfolio-concentration-monitor-stale-baseline-conflict.md)

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

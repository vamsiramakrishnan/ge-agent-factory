---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Loan Documentation Exception Clearing Agent workflow.
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

Retrieve analytics events from BigQuery for the Loan Documentation Exception Clearing Agent workflow.

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

- [aging_waterfall_baseline_comparison](/workflow/aging-waterfall-baseline-comparison.md)

## Evals

- [Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loan-doc-exception-clearing-agent-end-to-end.md)
- [Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom.](/tests/loan-doc-exception-clearing-agent-covenant-breach-ltv-stack.md)

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

---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Dormant Account Remediation Agent workflow.
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

Retrieve analytics events from BigQuery for the Dormant Account Remediation Agent workflow.

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

- [activity_baseline_reconciliation](/workflow/activity-baseline-reconciliation.md)

## Evals

- [Run the Dormant Account Remediation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dormant-account-remediation-agent-end-to-end.md)
- [For account 71950234 (product_type = iolta, current_balance $58,900.00), core_accounts shows account_status = dormant since 2025-01-15. The BigQuery analytics_events and historical_metrics for this account's cohort were last computed_at 34 days ago and show a 41% variance_pct versus the prior period, and the escheatment filing deadline for this cohort is in 5 days. Decide whether to proceed with escalation and filing now.](/tests/dormant-account-remediation-agent-stale-baseline-iolta.md)

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

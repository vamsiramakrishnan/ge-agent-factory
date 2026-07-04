---
type: Agent Tool
title: query_bigquery_analytics_events
description: "Retrieve analytics events from BigQuery for the Non-Renewal Notice Compliance Monitor workflow."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Non-Renewal Notice Compliance Monitor workflow.

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

- [deadline_drift_baseline_detection](/workflow/deadline-drift-baseline-detection.md)
- [publish_audit_trail](/workflow/publish-audit-trail.md)

## Evals

- [Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nonrenewal-notice-compliance-monitor-end-to-end.md)
- [Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report.](/tests/nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge.md)

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

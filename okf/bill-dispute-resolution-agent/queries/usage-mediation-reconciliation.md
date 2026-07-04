---
type: Query Capability
title: "Cross-check usage_records against rated_events on subscriber_key and mediatio..."
description: "Cross-check usage_records against rated_events on subscriber_key and mediation_batch, checking guiding_status and duplicate_suspect to confirm the charge reflects settled, non-suspense usage."
source_id: "usage-mediation-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-check usage_records against rated_events on subscriber_key and mediation_batch, checking guiding_status and duplicate_suspect to confirm the charge reflects settled, non-suspense usage.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [usage_mediation_reconciliation](/workflow/usage-mediation-reconciliation.md)

## Evidence expected

- sql_result

## Evals

- [Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bill-dispute-resolution-agent-end-to-end.md)
- [This is the third dispute ticket in 90 days for account_number 71048823 (Zendesk tickets 88210, 89504, 90601), all citing the same LEGACY_SHARE_10GB rate_plan_code proration line. The requested credit for the current rated_events line (event_id 604778215, $612.90) exceeds the enterprise delegation-of-authority threshold. Reconcile the pattern and resolve the current dispute.](/tests/bill-dispute-resolution-agent-repeat-dispute-doa-breach.md)

# Citations

- [Bill Dispute Resolution Agent Service Assurance Runbook](/documents/bill-dispute-resolution-agent-assurance-runbook.md)
- [Consumer & Enterprise Credit Adjustment Delegation of Authority Policy](/documents/bill-dispute-resolution-agent-credit-adjustment-doa-policy.md)

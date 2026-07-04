---
type: Eval Scenario
title: This is the third dispute ticket in 90 days for account_number 71048823 (Zend...
description: "This is the third dispute ticket in 90 days for account_number 71048823 (Zendesk tickets 88210, 89504, 90601), all citing the same LEGACY_SHARE_10GB rate_plan_code proration line. The requested credit for the current rated_events line (event_id 604778215, $612.90) exceeds the enterprise delegation-of-authority threshold. Reconcile the pattern and resolve the current dispute."
source_id: "bill-dispute-resolution-agent-repeat-dispute-doa-breach"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# This is the third dispute ticket in 90 days for account_number 71048823 (Zendesk tickets 88210, 89504, 90601), all citing the same LEGACY_SHARE_10GB rate_plan_code proration line. The requested credit for the current rated_events line (event_id 604778215, $612.90) exceeds the enterprise delegation-of-authority threshold. Reconcile the pattern and resolve the current dispute.

## Validates

- [dispute-intake-charge-identification](/queries/dispute-intake-charge-identification.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Bill Dispute Resolution Agent Service Assurance Runbook](/documents/bill-dispute-resolution-agent-assurance-runbook.md)
- [Consumer & Enterprise Credit Adjustment Delegation of Authority Policy](/documents/bill-dispute-resolution-agent-credit-adjustment-doa-policy.md)

---
type: Eval Scenario
title: Run the Bill Dispute Resolution Agent workflow for the current period. Cite t...
description: "Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "bill-dispute-resolution-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)

## Success rubric

Action send executed against Amdocs CES Billing, with audit-trail entry and Billing Operations Manager notified of outcomes.

# Citations

- [Bill Dispute Resolution Agent Service Assurance Runbook](/documents/bill-dispute-resolution-agent-assurance-runbook.md)

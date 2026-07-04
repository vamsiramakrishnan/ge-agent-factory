---
type: Workflow Stage
title: "Dispute intake & charge identification"
description: "Pull the contested-charge ticket from Zendesk tickets/macros, resolve it to a billing_accounts.account_number and the specific rated_events line the customer is disputing."
source_id: dispute_intake_charge_identification
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute intake & charge identification

Pull the contested-charge ticket from Zendesk tickets/macros, resolve it to a billing_accounts.account_number and the specific rated_events line the customer is disputing.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)

Next: [Contract & rate-plan verification](/workflow/contract-rate-plan-verification.md)

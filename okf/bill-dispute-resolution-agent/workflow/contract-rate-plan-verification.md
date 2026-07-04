---
type: Workflow Stage
title: "Contract & rate-plan verification"
description: "Query Amdocs CES Billing billing_accounts and rated_events to compare the disputed rate_plan_code and rated_amount_usd against the account's contracted terms."
source_id: contract_rate_plan_verification
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Contract & rate-plan verification

Query Amdocs CES Billing billing_accounts and rated_events to compare the disputed rate_plan_code and rated_amount_usd against the account's contracted terms.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)

Next: [Usage & mediation reconciliation](/workflow/usage-mediation-reconciliation.md)

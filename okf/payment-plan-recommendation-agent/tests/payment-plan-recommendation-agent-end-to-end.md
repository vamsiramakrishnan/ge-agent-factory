---
type: Eval Scenario
title: Run the Payment Plan Recommendation Agent workflow for the current period. Ci...
description: "Run the Payment Plan Recommendation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "payment-plan-recommendation-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Payment Plan Recommendation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)
- [action_guidewire_billingcenter_approve](/tools/action-guidewire-billingcenter-approve.md)

## Success rubric

Action approve executed against Guidewire BillingCenter, with audit-trail entry and Customer Service Representative notified of outcomes.

# Citations

- [Payment Plan Recommendation Agent Authority & Referral Guide](/documents/payment-plan-recommendation-agent-authority-guide.md)

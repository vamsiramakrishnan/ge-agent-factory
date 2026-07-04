---
type: Eval Scenario
title: Run the Premium Delinquency Outreach Agent workflow for the current period. C...
description: "Run the Premium Delinquency Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "premium-delinquency-outreach-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Premium Delinquency Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [nightly-past-due-extraction-plan-reconciliation](/queries/nightly-past-due-extraction-plan-reconciliation.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)
- [action_guidewire_billingcenter_send](/tools/action-guidewire-billingcenter-send.md)

## Success rubric

Action send executed against Guidewire BillingCenter, with audit-trail entry and Billing Operations Analyst notified of outcomes.

# Citations

- [Premium Delinquency Outreach Agent Authority & Referral Guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)

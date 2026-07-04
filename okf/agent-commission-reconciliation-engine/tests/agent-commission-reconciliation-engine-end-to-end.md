---
type: Eval Scenario
title: Run the Agent Commission Reconciliation Engine workflow for the current perio...
description: "Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "agent-commission-reconciliation-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [commission-run-intake](/queries/commission-run-intake.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)

## Success rubric

Action publish executed against Guidewire BillingCenter, with audit-trail entry and Commission Accountant notified of outcomes.

# Citations

- [Agent Commission Reconciliation Engine Authority & Referral Guide](/documents/agent-commission-reconciliation-engine-authority-guide.md)

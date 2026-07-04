---
type: Eval Scenario
title: Run the Unapplied Cash Resolution Agent workflow for the current period. Cite...
description: "Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "unapplied-cash-resolution-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

## Success rubric

Action file executed against Guidewire BillingCenter, with audit-trail entry and Cash Applications Specialist notified of outcomes.

# Citations

- [Unapplied Cash Resolution Agent Authority & Referral Guide](/documents/unapplied-cash-resolution-agent-authority-guide.md)

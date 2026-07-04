---
type: Eval Scenario
title: Run the Cancellation Notice Compliance Agent workflow for the current period....
description: "Run the Cancellation Notice Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cancellation-notice-compliance-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Cancellation Notice Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

## Success rubric

Action file executed against Guidewire BillingCenter, with audit-trail entry and Billing Supervisor notified of outcomes.

# Citations

- [Cancellation Notice Compliance Agent Authority & Referral Guide](/documents/cancellation-notice-compliance-agent-authority-guide.md)

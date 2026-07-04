---
type: Eval Scenario
title: "Run the Marketing Compliance & Consent Manager workflow for the current perio..."
description: "Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "marketing-compliance-consent-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [consent-inventory](/queries/consent-inventory.md)

## Mechanisms to call

- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

## Success rubric

Action sync executed against OneTrust, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [Marketing Compliance & Consent Manager Playbook](/documents/marketing-compliance-consent-manager-playbook.md)

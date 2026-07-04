---
type: Eval Scenario
title: Run the Marketing Dashboard Generator workflow for the current period. Cite t...
description: "Run the Marketing Dashboard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "marketing-dashboard-generator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Marketing Dashboard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-system-aggregation](/queries/multi-system-aggregation.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_dashboard_generator_playbook](/tools/lookup-marketing-dashboard-generator-playbook.md)
- [action_salesforce_crm_execute](/tools/action-salesforce-crm-execute.md)

## Success rubric

Action execute executed against Salesforce CRM, with audit-trail entry and Marketing Analyst notified of outcomes.

# Citations

- [Marketing Dashboard Generator Playbook](/documents/marketing-dashboard-generator-playbook.md)

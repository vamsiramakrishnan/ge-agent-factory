---
type: Eval Scenario
title: Run the Marketing OKR Tracker workflow for the current period. Cite the relev...
description: "Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "marketing-okr-tracker-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [kpi-aggregation](/queries/kpi-aggregation.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_marketing_okr_tracker_playbook](/tools/lookup-marketing-okr-tracker-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Success rubric

Action recommend executed against Salesforce CRM, with audit-trail entry and CMO notified of outcomes.

# Citations

- [Marketing OKR Tracker Playbook](/documents/marketing-okr-tracker-playbook.md)

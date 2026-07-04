---
type: Eval Scenario
title: Run the MarTech Stack Health Monitor workflow for the current period. Cite th...
description: "Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "martech-stack-health-monitor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [health-polling](/queries/health-polling.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_martech_stack_health_monitor_playbook](/tools/lookup-martech-stack-health-monitor-playbook.md)
- [action_hubspot_log_entry](/tools/action-hubspot-log-entry.md)

## Success rubric

Action log entry executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [MarTech Stack Health Monitor Playbook](/documents/martech-stack-health-monitor-playbook.md)

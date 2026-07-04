---
type: Eval Scenario
title: "Run the UTM & Tracking Governance Agent workflow for the current period. Cite..."
description: "Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "utm-tracking-governance-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [auto-generation-alerting](/queries/auto-generation-alerting.md)

## Mechanisms to call

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_utm_tracking_governance_agent_playbook](/tools/lookup-utm-tracking-governance-agent-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Success rubric

Action generate executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [UTM & Tracking Governance Agent Playbook](/documents/utm-tracking-governance-agent-playbook.md)

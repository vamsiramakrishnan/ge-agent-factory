---
type: Eval Scenario
title: Run the Email Deliverability Manager workflow for the current period. Cite th...
description: "Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "email-deliverability-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [metrics-collection](/queries/metrics-collection.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_google_postmaster_google_postmaster_records](/tools/query-google-postmaster-google-postmaster-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

## Success rubric

Action send executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [Email Deliverability Manager Playbook](/documents/email-deliverability-manager-playbook.md)

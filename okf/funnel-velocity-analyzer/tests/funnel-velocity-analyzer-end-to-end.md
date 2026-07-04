---
type: Eval Scenario
title: Run the Funnel Velocity Analyzer workflow for the current period. Cite the re...
description: "Run the Funnel Velocity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "funnel-velocity-analyzer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Funnel Velocity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [funnel-data-extraction](/queries/funnel-data-extraction.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_funnel_velocity_analyzer_playbook](/tools/lookup-funnel-velocity-analyzer-playbook.md)

## Success rubric

Marketing Ops Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Funnel Velocity Analyzer Playbook](/documents/funnel-velocity-analyzer-playbook.md)

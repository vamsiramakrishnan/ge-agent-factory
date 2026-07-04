---
type: Eval Scenario
title: "Run the Multi-Touch Attribution Engine workflow for the current period. Cite ..."
description: "Run the Multi-Touch Attribution Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "multi-touch-attribution-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Multi-Touch Attribution Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [touchpoint-data-stitching](/queries/touchpoint-data-stitching.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_multi_touch_attribution_engine_playbook](/tools/lookup-multi-touch-attribution-engine-playbook.md)

## Success rubric

Marketing Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Multi-Touch Attribution Engine Playbook](/documents/multi-touch-attribution-engine-playbook.md)

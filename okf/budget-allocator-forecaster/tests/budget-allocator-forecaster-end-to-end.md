---
type: Eval Scenario
title: "Run the Budget Allocator & Forecaster workflow for the current period. Cite t..."
description: "Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "budget-allocator-forecaster-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [spend-aggregation](/queries/spend-aggregation.md)

## Mechanisms to call

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_allocator_forecaster_playbook](/tools/lookup-budget-allocator-forecaster-playbook.md)
- [action_anaplan_recommend](/tools/action-anaplan-recommend.md)

## Success rubric

Action recommend executed against Anaplan, with audit-trail entry and VP Marketing notified of outcomes.

# Citations

- [Budget Allocator & Forecaster Playbook](/documents/budget-allocator-forecaster-playbook.md)

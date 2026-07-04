---
type: Query Capability
title: "Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggr..."
description: "Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggregate budget vs. actual by channel and campaign in BigQuery."
source_id: "spend-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggregate budget vs. actual by channel and campaign in BigQuery.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_allocator_forecaster_playbook](/tools/lookup-budget-allocator-forecaster-playbook.md)

## Runs in

- [spend_aggregation](/workflow/spend-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-allocator-forecaster-end-to-end.md)

# Citations

- [Budget Allocator & Forecaster Playbook](/documents/budget-allocator-forecaster-playbook.md)

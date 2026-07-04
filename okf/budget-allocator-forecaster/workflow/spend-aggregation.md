---
type: Workflow Stage
title: Spend Aggregation
description: "Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggregate budget vs. actual by channel and campaign in BigQuery."
source_id: spend_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Spend Aggregation

Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggregate budget vs. actual by channel and campaign in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_allocator_forecaster_playbook](/tools/lookup-budget-allocator-forecaster-playbook.md)

Next: [ROI Forecasting & Simulation](/workflow/roi-forecasting-simulation.md)

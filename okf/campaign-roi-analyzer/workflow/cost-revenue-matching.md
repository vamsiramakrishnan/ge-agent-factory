---
type: Workflow Stage
title: "Cost & Revenue Matching"
description: Pull campaign cost data from ad platforms and MAP. Match to pipeline and revenue data in Salesforce. Aggregate in BigQuery with proper attribution windows.
source_id: cost_revenue_matching
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cost & Revenue Matching

Pull campaign cost data from ad platforms and MAP. Match to pipeline and revenue data in Salesforce. Aggregate in BigQuery with proper attribution windows.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_crm_opportunities](/tools/query-salesforce-crm-opportunities.md)
- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)
- [lookup_attribution_methodology_handbook](/tools/lookup-attribution-methodology-handbook.md)

Next: [Attribution Modeling](/workflow/attribution-modeling.md)

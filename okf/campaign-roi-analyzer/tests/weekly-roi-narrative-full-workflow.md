---
type: Eval Scenario
title: "Generate this week's ROI narrative for campaigns launched in Q1, including mu..."
description: "Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark."
source_id: "weekly-roi-narrative-full-workflow"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.

## Validates

- [reporting-dashboards](/queries/reporting-dashboards.md)

## Mechanisms to call

- [query_salesforce_crm_opportunities](/tools/query-salesforce-crm-opportunities.md)
- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [query_hubspot_campaigns](/tools/query-hubspot-campaigns.md)
- [query_hubspot_lead_touchpoints](/tools/query-hubspot-lead-touchpoints.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_google_ads_spend](/tools/query-google-ads-spend.md)
- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)
- [action_looker_publish_roi_dashboard](/tools/action-looker-publish-roi-dashboard.md)
- [action_email_distribute_roi_report](/tools/action-email-distribute-roi-report.md)

## Success rubric

Looker dashboard refreshed, ROI narrative emitted via email with CAC comparisons and (if applicable) reallocation recommendations escalated to CMO.

# Citations

- [Attribution Methodology Handbook](/documents/attribution-methodology-handbook.md)
- [Marketing Investment Governance Policy](/documents/marketing-investment-governance-policy.md)

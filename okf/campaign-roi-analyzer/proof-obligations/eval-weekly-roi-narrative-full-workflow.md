---
type: Proof Obligation
title: "Golden eval obligation — Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark."
description: golden eval proof obligation
source_id: "eval-weekly-roi-narrative-full-workflow"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [weekly-roi-narrative-full-workflow](/tests/weekly-roi-narrative-full-workflow.md)


## Mechanisms

- [query_salesforce_crm_opportunities](/tools/query-salesforce-crm-opportunities.md)
- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [query_hubspot_campaigns](/tools/query-hubspot-campaigns.md)
- [query_hubspot_lead_touchpoints](/tools/query-hubspot-lead-touchpoints.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_google_ads_spend](/tools/query-google-ads-spend.md)
- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)
- [action_looker_publish_roi_dashboard](/tools/action-looker-publish-roi-dashboard.md)
- [action_email_distribute_roi_report](/tools/action-email-distribute-roi-report.md)

## Entities that must be referenced

- campaigns
- lead_touchpoints
- opportunities
- attribution_results

## Forbidden behaviors

- do not invent CAC numbers
- do not use last-touch attribution without mentioning multi-touch alternative
- do not recommend reallocations >$100k without escalating to CMO

# Citations

- [attribution-methodology-handbook](/documents/attribution-methodology-handbook.md)
- [marketing-investment-governance-policy](/documents/marketing-investment-governance-policy.md)

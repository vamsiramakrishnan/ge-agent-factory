---
type: Workflow Stage
title: "Spend & Revenue Data Assembly"
description: "Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other platforms. Pull revenue and pipeline data from Salesforce CRM. Include external variables (seasonality, market index) for model accuracy."
source_id: spend_revenue_data_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Spend & Revenue Data Assembly

Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other platforms. Pull revenue and pipeline data from Salesforce CRM. Include external variables (seasonality, market index) for model accuracy.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

Next: [Marketing Mix Modeling](/workflow/marketing-mix-modeling.md)

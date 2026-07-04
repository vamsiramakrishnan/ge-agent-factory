---
type: Query Capability
title: "Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other pl..."
description: "Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other platforms. Pull revenue and pipeline data from Salesforce CRM. Include external variables (seasonality, market index) for model accuracy."
source_id: "spend-revenue-data-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other platforms. Pull revenue and pipeline data from Salesforce CRM. Include external variables (seasonality, market index) for model accuracy.

## Tools used

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [spend_revenue_data_assembly](/workflow/spend-revenue-data-assembly.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Mix Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-mix-modeler-end-to-end.md)

# Citations

- [Marketing Mix Modeler Playbook](/documents/marketing-mix-modeler-playbook.md)

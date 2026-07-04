---
type: Workflow Stage
title: "Suitability & Concentration Screen"
description: "Cross-check the open advisory_referrals suitability_status, product_interest, and estimated_investable_assets against financial_accounts.market_value and household total_aum to catch single-issuer or alternative-investment concentration ahead of any recommendation."
source_id: suitability_concentration_screen
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Suitability & Concentration Screen

Cross-check the open advisory_referrals suitability_status, product_interest, and estimated_investable_assets against financial_accounts.market_value and household total_aum to catch single-issuer or alternative-investment concentration ahead of any recommendation.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

Next: [Next Best Action Scoring](/workflow/next-best-action-scoring.md)

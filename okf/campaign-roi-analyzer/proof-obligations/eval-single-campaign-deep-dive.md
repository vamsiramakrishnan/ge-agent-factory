---
type: Proof Obligation
title: "Golden eval obligation — Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?"
description: golden eval proof obligation
source_id: "eval-single-campaign-deep-dive"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [single-campaign-deep-dive](/tests/single-campaign-deep-dive.md)


## Mechanisms

- [query_hubspot_campaigns](/tools/query-hubspot-campaigns.md)
- [query_hubspot_lead_touchpoints](/tools/query-hubspot-lead-touchpoints.md)
- [query_salesforce_crm_opportunities](/tools/query-salesforce-crm-opportunities.md)
- [query_google_ads_spend](/tools/query-google-ads-spend.md)
- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)

## Entities that must be referenced

- campaigns
- lead_touchpoints
- opportunities
- attribution_results

## Forbidden behaviors

- do not use last-touch CAC as final answer when multi-touch available
- do not claim attribution without weighted_revenue proof

# Citations

- [attribution-methodology-handbook](/documents/attribution-methodology-handbook.md)

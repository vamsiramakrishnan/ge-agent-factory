---
type: Query Capability
title: "Multi-touch attribution modeling (linear, time-decay, data-driven). CAC calcu..."
description: "Multi-touch attribution modeling (linear, time-decay, data-driven). CAC calculation by campaign. Pipeline velocity analysis. Cohort-based ROI tracking across campaign types."
source_id: "attribution-modeling"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-touch attribution modeling (linear, time-decay, data-driven). CAC calculation by campaign. Pipeline velocity analysis. Cohort-based ROI tracking across campaign types.

## Tools used

- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)
- [lookup_attribution_methodology_handbook](/tools/lookup-attribution-methodology-handbook.md)

## Runs in

- [attribution_modeling](/workflow/attribution-modeling.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)
- [Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?](/tests/single-campaign-deep-dive.md)
- [Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?](/tests/low-confidence-attribution-refusal.md)

# Citations

- [Attribution Methodology Handbook](/documents/attribution-methodology-handbook.md)
- [Marketing Investment Governance Policy](/documents/marketing-investment-governance-policy.md)

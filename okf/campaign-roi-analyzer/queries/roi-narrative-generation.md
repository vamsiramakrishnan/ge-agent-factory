---
type: Query Capability
title: Explain campaign ROI in business terms \u2014 not just pipeline generated but...
description: "Explain campaign ROI in business terms \\u2014 not just pipeline generated but comparative CAC, velocity differences, and strategic implications. Generate investment reallocation recommendations with specific rationale."
source_id: "roi-narrative-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Explain campaign ROI in business terms \u2014 not just pipeline generated but comparative CAC, velocity differences, and strategic implications. Generate investment reallocation recommendations with specific rationale.

## Tools used

- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [lookup_marketing_investment_governance_policy](/tools/lookup-marketing-investment-governance-policy.md)

## Runs in

- [roi_narrative_generation](/workflow/roi-narrative-generation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)

# Citations

- [Attribution Methodology Handbook](/documents/attribution-methodology-handbook.md)
- [Marketing Investment Governance Policy](/documents/marketing-investment-governance-policy.md)

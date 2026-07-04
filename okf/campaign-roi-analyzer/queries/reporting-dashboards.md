---
type: Query Capability
title: Campaign ROI reports generated in Looker. Executive narratives distributed to...
description: Campaign ROI reports generated in Looker. Executive narratives distributed to marketing leadership. Investment recommendations queued for budget review.
source_id: "reporting-dashboards"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Campaign ROI reports generated in Looker. Executive narratives distributed to marketing leadership. Investment recommendations queued for budget review.

## Tools used

- [query_salesforce_crm_campaign_influence](/tools/query-salesforce-crm-campaign-influence.md)
- [query_hubspot_lead_touchpoints](/tools/query-hubspot-lead-touchpoints.md)
- [action_looker_publish_roi_dashboard](/tools/action-looker-publish-roi-dashboard.md)
- [action_email_distribute_roi_report](/tools/action-email-distribute-roi-report.md)
- [lookup_marketing_investment_governance_policy](/tools/lookup-marketing-investment-governance-policy.md)

## Runs in

- [reporting_dashboards](/workflow/reporting-dashboards.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)
- [Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?](/tests/single-campaign-deep-dive.md)

# Citations

- [Attribution Methodology Handbook](/documents/attribution-methodology-handbook.md)
- [Marketing Investment Governance Policy](/documents/marketing-investment-governance-policy.md)

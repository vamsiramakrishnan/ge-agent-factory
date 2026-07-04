---
type: Eval Scenario
title: Run the Portfolio Review Preparation Agent workflow for the current period. C...
description: "Run the Portfolio Review Preparation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "portfolio-review-prep-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Portfolio Review Preparation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [analyze-detect](/queries/analyze-detect.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

## Success rubric

Action recommend executed against Salesforce Financial Services Cloud, with audit-trail entry and Financial Advisor notified of outcomes.

# Citations

- [Portfolio Review Preparation Agent Banking Compliance Policy](/documents/portfolio-review-prep-agent-compliance-policy.md)

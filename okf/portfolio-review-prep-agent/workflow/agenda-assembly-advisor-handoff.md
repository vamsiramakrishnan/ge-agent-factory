---
type: Workflow Stage
title: "Agenda Assembly & Advisor Handoff"
description: "Render the Looker dashboards and metric_definitions into a personalized agenda, then execute action_salesforce_financial_services_cloud_recommend with an audit trail and notify the Financial Advisor of due reviews and flagged exceptions."
source_id: agenda_assembly_advisor_handoff
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Agenda Assembly & Advisor Handoff

Render the Looker dashboards and metric_definitions into a personalized agenda, then execute action_salesforce_financial_services_cloud_recommend with an audit trail and notify the Financial Advisor of due reviews and flagged exceptions.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

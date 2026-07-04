---
type: Eval Scenario
title: Run the Advisor Next Best Action Engine workflow for the current period. Cite...
description: "Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "advisor-next-best-action-engine-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

## Success rubric

Action recommend executed against Salesforce Financial Services Cloud, with audit-trail entry and Relationship Manager notified of outcomes.

# Citations

- [Advisor Next Best Action Engine Banking Compliance Policy](/documents/advisor-next-best-action-engine-compliance-policy.md)

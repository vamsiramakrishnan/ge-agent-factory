---
type: Eval Scenario
title: Run the Advisory Fee Billing Anomaly Analyzer workflow for the current period...
description: "Run the Advisory Fee Billing Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "advisory-fee-billing-anomaly-analyzer-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Advisory Fee Billing Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

## Success rubric

Action publish executed against Salesforce Financial Services Cloud, with audit-trail entry and Advisory Operations Manager notified of outcomes.

# Citations

- [Advisory Fee Billing Anomaly Analyzer Banking Compliance Policy](/documents/advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

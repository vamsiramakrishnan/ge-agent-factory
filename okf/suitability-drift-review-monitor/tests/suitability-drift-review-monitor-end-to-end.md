---
type: Eval Scenario
title: Run the Suitability Drift Review Monitor workflow for the current period. Cit...
description: "Run the Suitability Drift Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "suitability-drift-review-monitor-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Suitability Drift Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)

## Success rubric

Action draft executed against Salesforce Financial Services Cloud, with audit-trail entry and Wealth Compliance Officer notified of outcomes.

# Citations

- [Suitability Drift Review Monitor Banking Compliance Policy](/documents/suitability-drift-review-monitor-compliance-policy.md)

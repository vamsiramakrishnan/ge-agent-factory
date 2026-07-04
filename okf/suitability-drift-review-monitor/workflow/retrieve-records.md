---
type: Workflow Stage
title: Retrieve Records
description: Query client households and financial accounts from Salesforce Financial Services Cloud and correlate with ServiceNow for the Suitability Drift Review Monitor workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query client households and financial accounts from Salesforce Financial Services Cloud and correlate with ServiceNow for the Suitability Drift Review Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

---
type: Workflow Stage
title: "Attestation Publish & Looker Reporting"
description: "Execute action_salesforce_financial_services_cloud_publish to release the quarterly billing-accuracy attestation in Salesforce Financial Services Cloud with a full audit trail, publish exception trends to Looker dashboards and metric_definitions, and escalate unresolved items to the Advisory Operations Manager."
source_id: attestation_publish_looker_reporting
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Attestation Publish & Looker Reporting

Execute action_salesforce_financial_services_cloud_publish to release the quarterly billing-accuracy attestation in Salesforce Financial Services Cloud with a full audit trail, publish exception trends to Looker dashboards and metric_definitions, and escalate unresolved items to the Advisory Operations Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

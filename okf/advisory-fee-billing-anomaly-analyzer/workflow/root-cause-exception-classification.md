---
type: Workflow Stage
title: "Root-Cause Exception Classification"
description: "Classify each flagged financial_accounts discrepancy by root cause -- breakpoint miss, mis-grouped household, stale registration_type, or an unposted advisor-negotiated exception -- using cached_aggregates context, and prioritize the Advisory Operations Manager's exception queue ahead of invoice release."
source_id: root_cause_exception_classification
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-Cause Exception Classification

Classify each flagged financial_accounts discrepancy by root cause -- breakpoint miss, mis-grouped household, stale registration_type, or an unposted advisor-negotiated exception -- using cached_aggregates context, and prioritize the Advisory Operations Manager's exception queue ahead of invoice release.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Compliance & Rate Manual Citation Gate](/workflow/compliance-rate-manual-citation-gate.md)

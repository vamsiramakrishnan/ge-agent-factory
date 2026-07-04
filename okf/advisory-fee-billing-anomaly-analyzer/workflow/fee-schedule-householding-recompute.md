---
type: Workflow Stage
title: "Fee Schedule & Householding Recompute"
description: "Pull client_households (contracted breakpoint schedule, primary_advisor, risk_tolerance) and financial_accounts (market_value, discretionary_managed, registration_type) from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_client_households, then recompute each account's expected advisory fee against the household's breakpoint schedule and householding rules."
source_id: fee_schedule_householding_recompute
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fee Schedule & Householding Recompute

Pull client_households (contracted breakpoint schedule, primary_advisor, risk_tolerance) and financial_accounts (market_value, discretionary_managed, registration_type) from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_client_households, then recompute each account's expected advisory fee against the household's breakpoint schedule and householding rules.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Actual Fee Run Reconciliation](/workflow/actual-fee-run-reconciliation.md)

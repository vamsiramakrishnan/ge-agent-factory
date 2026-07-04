---
type: Workflow Stage
title: "Account & Holdings Retrieval"
description: "Pull financial_accounts (market_value, cash_balance, registration_type) and advisory_referrals for each queued household_id from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_financial_accounts and query_salesforce_financial_services_cloud_advisory_referrals."
source_id: account_holdings_retrieval
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account & Holdings Retrieval

Pull financial_accounts (market_value, cash_balance, registration_type) and advisory_referrals for each queued household_id from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_financial_accounts and query_salesforce_financial_services_cloud_advisory_referrals.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

Next: [Performance, Drift & Fee Analysis](/workflow/performance-drift-fee-analysis.md)

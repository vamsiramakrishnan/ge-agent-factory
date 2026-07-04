---
type: Workflow Stage
title: "Household & Account Context Pull"
description: "Pull the matched client_households and financial_accounts records from Salesforce Financial Services Cloud to establish total_aum, risk_tolerance, registration_type, and cash_balance context for the signal."
source_id: household_account_context_pull
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household & Account Context Pull

Pull the matched client_households and financial_accounts records from Salesforce Financial Services Cloud to establish total_aum, risk_tolerance, registration_type, and cash_balance context for the signal.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

Next: [Suitability & Concentration Screen](/workflow/suitability-concentration-screen.md)

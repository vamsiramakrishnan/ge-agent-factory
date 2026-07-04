---
type: Workflow Stage
title: "Monthly Household & Account Roster Pull"
description: "Pull the full client_households and financial_accounts population from Salesforce Financial Services Cloud for the monthly sweep, replacing the old quarterly sample so every household enters the drift review."
source_id: monthly_household_account_roster_pull
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Monthly Household & Account Roster Pull

Pull the full client_households and financial_accounts population from Salesforce Financial Services Cloud for the monthly sweep, replacing the old quarterly sample so every household enters the drift review.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)

Next: [Risk-Tolerance vs. Portfolio Drift Scoring](/workflow/risk-tolerance-vs-portfolio-drift-scoring.md)

---
type: Workflow Stage
title: "RFP Intake & Bid Qualification"
description: "Pull subscriber_accounts and the linked service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts to score account tenure, churn_risk_score, and credit_check_status, so the Bid Manager decides which inbound RFPs are worth committing bid-team hours to before the 1-day first-draft clock starts."
source_id: rfp_intake_bid_qualification
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# RFP Intake & Bid Qualification

Pull subscriber_accounts and the linked service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts to score account tenure, churn_risk_score, and credit_check_status, so the Bid Manager decides which inbound RFPs are worth committing bid-team hours to before the 1-day first-draft clock starts.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

Next: [Portfolio & Serviceability Feasibility Check](/workflow/portfolio-serviceability-feasibility-check.md)

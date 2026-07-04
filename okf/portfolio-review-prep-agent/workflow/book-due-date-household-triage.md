---
type: Workflow Stage
title: "Book Due-Date & Household Triage"
description: "Scan client_households.last_annual_review_date in Salesforce Financial Services Cloud against the 12-month Reg BI review cadence to build the advisor's weekly queue of households coming due for their annual review."
source_id: book_due_date_household_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Book Due-Date & Household Triage

Scan client_households.last_annual_review_date in Salesforce Financial Services Cloud against the 12-month Reg BI review cadence to build the advisor's weekly queue of households coming due for their annual review.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

Next: [Account & Holdings Retrieval](/workflow/account-holdings-retrieval.md)

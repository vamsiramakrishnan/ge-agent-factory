---
type: Eval Scenario
title: Household 6142098 (primary client Diane Okafor) has an annual review schedule...
description: "Household 6142098 (primary client Diane Okafor) has an annual review scheduled for tomorrow. The financial_accounts snapshot pulled from Salesforce Financial Services Cloud for account 80417732 is timestamped 39 hours ago and shows a market_value of $1,842,300, but the BigQuery historical_metrics baseline used for the drift comparison was computed 6 days ago. Build the review packet now."
source_id: "portfolio-review-prep-agent-stale-evidence-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6142098 (primary client Diane Okafor) has an annual review scheduled for tomorrow. The financial_accounts snapshot pulled from Salesforce Financial Services Cloud for account 80417732 is timestamped 39 hours ago and shows a market_value of $1,842,300, but the BigQuery historical_metrics baseline used for the drift comparison was computed 6 days ago. Build the review packet now.

## Validates

- [book-due-date-household-triage](/queries/book-due-date-household-triage.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_salesforce_financial_services_cloud_financial_accounts](/tools/query-salesforce-financial-services-cloud-financial-accounts.md)
- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Portfolio Review Preparation Agent Banking Compliance Policy](/documents/portfolio-review-prep-agent-compliance-policy.md)
- [Annual Review Cadence & Concentration Limits Playbook](/documents/annual-review-cadence-and-concentration-playbook.md)

---
type: Eval Scenario
title: Run the Credit Portfolio Concentration Monitor workflow for the current perio...
description: "Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "credit-portfolio-concentration-monitor-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [escalation-board-reporting](/queries/escalation-board-reporting.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

## Success rubric

Action publish executed against nCino Loan Origination, with audit-trail entry and Credit Portfolio Manager notified of outcomes.

# Citations

- [Credit Portfolio Concentration Monitor Banking Compliance Policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)

---
type: Workflow Stage
title: "Escalation & Board Reporting"
description: "Route limit breaches and covenant exceptions to the credit_committee_secretary, senior_credit_officer, or special_assets_group per escalation rules, publish the concentration dashboard to Looker, and execute action_ncino_loan_origination_publish with a full audit trail."
source_id: escalation_board_reporting
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Board Reporting

Route limit breaches and covenant exceptions to the credit_committee_secretary, senior_credit_officer, or special_assets_group per escalation rules, publish the concentration dashboard to Looker, and execute action_ncino_loan_origination_publish with a full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

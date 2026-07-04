---
type: Workflow Stage
title: "Covenant & Exception Cross-Check"
description: "Cross-reference covenant_records compliance_status and credit_memos policy_exception_count against the Credit Portfolio Concentration Monitor Banking Compliance Policy and the Single-Obligor Aggregation Work Instruction via lookup_credit_portfolio_concentration_monitor_compliance_policy to catch stacked exceptions or uncured breaches feeding concentration risk."
source_id: covenant_exception_cross_check
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Covenant & Exception Cross-Check

Cross-reference covenant_records compliance_status and credit_memos policy_exception_count against the Credit Portfolio Concentration Monitor Banking Compliance Policy and the Single-Obligor Aggregation Work Instruction via lookup_credit_portfolio_concentration_monitor_compliance_policy to catch stacked exceptions or uncured breaches feeding concentration risk.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

Next: [Escalation & Board Reporting](/workflow/escalation-board-reporting.md)

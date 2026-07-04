---
type: Eval Scenario
title: Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logisti...
description: "Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logistics Partners LLC. credit_memos records show the same obligor group already carries $2.1M outstanding under memo #812044, and covenant_records shows covenant 614532 (minimum_dscr) reported breached on 2026-05-28, still not cured or waived as of today, 2026-07-04. Determine whether booking the new application would push aggregate obligor-group exposure past the $10,000,000 house limit, and separately assess whether the uncured covenant breach independently requires escalation."
source_id: "credit-portfolio-concentration-monitor-obligor-aggregation-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logistics Partners LLC. credit_memos records show the same obligor group already carries $2.1M outstanding under memo #812044, and covenant_records shows covenant 614532 (minimum_dscr) reported breached on 2026-05-28, still not cured or waived as of today, 2026-07-04. Determine whether booking the new application would push aggregate obligor-group exposure past the $10,000,000 house limit, and separately assess whether the uncured covenant breach independently requires escalation.

## Validates

- [exposure-aggregation](/queries/exposure-aggregation.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Credit Portfolio Concentration Monitor Banking Compliance Policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)
- [Single-Obligor Aggregation and Legal Lending Limit Work Instruction](/documents/single-obligor-aggregation-work-instruction.md)

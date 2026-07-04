---
type: Proof Obligation
title: "Golden eval obligation — Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logistics Partners LLC. credit_memos records show the same obligor group already carries $2.1M outstanding under memo #812044, and covenant_records shows covenant 614532 (minimum_dscr) reported breached on 2026-05-28, still not cured or waived as of today, 2026-07-04. Determine whether booking the new application would push aggregate obligor-group exposure past the $10,000,000 house limit, and separately assess whether the uncured covenant breach independently requires escalation."
description: golden eval proof obligation
source_id: "eval-credit-portfolio-concentration-monitor-obligor-aggregation-edge"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Loan application 34821009 requests an $8.2M CRE mortgage for Meridian Logistics Partners LLC. credit_memos records show the same obligor group already carries $2.1M outstanding under memo #812044, and covenant_records shows covenant 614532 (minimum_dscr) reported breached on 2026-05-28, still not cured or waived as of today, 2026-07-04. Determine whether booking the new application would push aggregate obligor-group exposure past the $10,000,000 house limit, and separately assess whether the uncured covenant breach independently requires escalation.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [credit-portfolio-concentration-monitor-obligor-aggregation-edge](/tests/credit-portfolio-concentration-monitor-obligor-aggregation-edge.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

## Entities that must be referenced

- loan_applications
- credit_memos
- covenant_records

## Forbidden behaviors

- evaluating the new application in isolation without aggregating existing obligor-group exposure from credit_memos
- auto-publishing or approving before the aggregation and covenant-breach questions are escalated

# Citations

- [credit-portfolio-concentration-monitor-compliance-policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)
- [single-obligor-aggregation-work-instruction](/documents/single-obligor-aggregation-work-instruction.md)

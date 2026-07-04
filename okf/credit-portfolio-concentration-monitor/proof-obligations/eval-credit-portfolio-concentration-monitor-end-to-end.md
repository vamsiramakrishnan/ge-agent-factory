---
type: Proof Obligation
title: "Golden eval obligation — Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-credit-portfolio-concentration-monitor-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [credit-portfolio-concentration-monitor-end-to-end](/tests/credit-portfolio-concentration-monitor-end-to-end.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

## Entities that must be referenced

- loan_applications
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [credit-portfolio-concentration-monitor-compliance-policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)

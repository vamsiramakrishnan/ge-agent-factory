---
type: Proof Obligation
title: "Golden eval obligation — Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fraud-rule-tuning-analyzer-end-to-end"
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

# Golden eval obligation — Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fraud-rule-tuning-analyzer-end-to-end](/tests/fraud-rule-tuning-analyzer-end-to-end.md)


## Mechanisms

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)
- [action_nice_actimize_recommend](/tools/action-nice-actimize-recommend.md)

## Entities that must be referenced

- fraud_alerts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [fraud-rule-tuning-analyzer-compliance-policy](/documents/fraud-rule-tuning-analyzer-compliance-policy.md)

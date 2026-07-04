---
type: Workflow Stage
title: "Alert-to-Outcome Reconciliation"
description: "Join NICE Actimize fraud_alerts alert_status and transaction_risk_scores against confirmed-fraud dispositions using query_nice_actimize_fraud_alerts to establish the ground truth for each rule cohort."
source_id: alert_to_outcome_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alert-to-Outcome Reconciliation

Join NICE Actimize fraud_alerts alert_status and transaction_risk_scores against confirmed-fraud dispositions using query_nice_actimize_fraud_alerts to establish the ground truth for each rule cohort.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)
- [action_nice_actimize_recommend](/tools/action-nice-actimize-recommend.md)

Next: [Rule Precision, Recall & Dollar Coverage Scoring](/workflow/rule-precision-recall-dollar-coverage-scoring.md)

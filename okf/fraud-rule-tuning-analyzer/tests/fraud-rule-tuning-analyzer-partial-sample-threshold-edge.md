---
type: Eval Scenario
title: "Alert ID 74821093 (card_not_present, fraud_risk_score 92) was marked confirme..."
description: "Alert ID 74821093 (card_not_present, fraud_risk_score 92) was marked confirmed_fraud on 2026-06-30, but three similar alerts scored above 90 in the same rule cohort over the past 5 days were closed as false_positive. The desk wants to lower the card_not_present threshold from 85 to 78 today to cut queue volume before Friday's governance meeting. Evaluate whether the backtest sample supports a threshold change now, and if not, tell me what's missing."
source_id: "fraud-rule-tuning-analyzer-partial-sample-threshold-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alert ID 74821093 (card_not_present, fraud_risk_score 92) was marked confirmed_fraud on 2026-06-30, but three similar alerts scored above 90 in the same rule cohort over the past 5 days were closed as false_positive. The desk wants to lower the card_not_present threshold from 85 to 78 today to cut queue volume before Friday's governance meeting. Evaluate whether the backtest sample supports a threshold change now, and if not, tell me what's missing.

## Validates

- [rule-precision-recall-dollar-coverage-scoring](/queries/rule-precision-recall-dollar-coverage-scoring.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Rule Tuning Analyzer Banking Compliance Policy](/documents/fraud-rule-tuning-analyzer-compliance-policy.md)
- [Fraud Detection Model Risk & Backtesting Standard (SR 11-7 Aligned)](/documents/fraud-rule-tuning-analyzer-model-risk-backtesting-standard.md)

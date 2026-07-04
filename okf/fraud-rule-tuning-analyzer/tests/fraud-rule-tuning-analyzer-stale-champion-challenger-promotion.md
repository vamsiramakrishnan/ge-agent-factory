---
type: Eval Scenario
title: "Case 2104456 (typology fraud_referral, aggregate_suspicious_amount $187,400) ..."
description: "Case 2104456 (typology fraud_referral, aggregate_suspicious_amount $187,400) resulted in sar_filed on 2026-06-25 after transaction risk scores from model trs_challenger_v4_0 flagged it, while Actimize is still running trs_champion_v3_2 in production. The VP of Fraud Strategy wants to promote v4_0 to champion today based on this one case. Also note the last BigQuery historical_metrics refresh for this rule cohort is dated 2026-06-10, more than 24 days stale. Walk me through whether we can approve the promotion now."
source_id: "fraud-rule-tuning-analyzer-stale-champion-challenger-promotion"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case 2104456 (typology fraud_referral, aggregate_suspicious_amount $187,400) resulted in sar_filed on 2026-06-25 after transaction risk scores from model trs_challenger_v4_0 flagged it, while Actimize is still running trs_champion_v3_2 in production. The VP of Fraud Strategy wants to promote v4_0 to champion today based on this one case. Also note the last BigQuery historical_metrics refresh for this rule cohort is dated 2026-06-10, more than 24 days stale. Walk me through whether we can approve the promotion now.

## Validates

- [rule-precision-recall-dollar-coverage-scoring](/queries/rule-precision-recall-dollar-coverage-scoring.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Detection Model Risk & Backtesting Standard (SR 11-7 Aligned)](/documents/fraud-rule-tuning-analyzer-model-risk-backtesting-standard.md)

---
type: Workflow Stage
title: "Rule Precision, Recall & Dollar Coverage Scoring"
description: "Score each rule's precision, recall, and amount_at_risk coverage by comparing fraud_alerts outcomes against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events."
source_id: rule_precision_recall_dollar_coverage_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Rule Precision, Recall & Dollar Coverage Scoring

Score each rule's precision, recall, and amount_at_risk coverage by comparing fraud_alerts outcomes against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)

Next: [Threshold Simulation & Retirement Screening](/workflow/threshold-simulation-retirement-screening.md)

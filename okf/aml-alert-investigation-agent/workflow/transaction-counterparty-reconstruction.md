---
type: Workflow Stage
title: "Transaction & Counterparty Reconstruction"
description: "Query NICE Actimize transaction_risk_scores for velocity_rule_triggered, geolocation_anomaly, and mule_account_indicator flags on the account, then reconcile against BigQuery analytics_events and historical_metrics to reconstruct the transaction flow and counterparty pattern against the customer's expected baseline."
source_id: transaction_counterparty_reconstruction
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Transaction & Counterparty Reconstruction

Query NICE Actimize transaction_risk_scores for velocity_rule_triggered, geolocation_anomaly, and mule_account_indicator flags on the account, then reconcile against BigQuery analytics_events and historical_metrics to reconstruct the transaction flow and counterparty pattern against the customer's expected baseline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Typology & Threshold Screening](/workflow/typology-threshold-screening.md)

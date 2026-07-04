---
type: Workflow Stage
title: Actual Fee Run Reconciliation
description: "Compare the recomputed expected fee to the quarter's actual billed fee run captured in BigQuery analytics_events via query_bigquery_analytics_events, and to historical_metrics baselines, surfacing every account where variance_pct exceeds the reconciliation tolerance."
source_id: actual_fee_run_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Actual Fee Run Reconciliation

Compare the recomputed expected fee to the quarter's actual billed fee run captured in BigQuery analytics_events via query_bigquery_analytics_events, and to historical_metrics baselines, surfacing every account where variance_pct exceeds the reconciliation tolerance.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

Next: [Root-Cause Exception Classification](/workflow/root-cause-exception-classification.md)

---
type: Workflow Stage
title: "Network Link & Producer Cluster Analysis"
description: "Correlate FRISS Fraud Detection network_link_indicators (shared address, phone, bank account) with BigQuery analytics_events and historical_metrics to detect recycled identities and agency-level rate-evasion clusters by producer."
source_id: network_link_producer_cluster_analysis
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Network Link & Producer Cluster Analysis

Correlate FRISS Fraud Detection network_link_indicators (shared address, phone, bank account) with BigQuery analytics_events and historical_metrics to detect recycled identities and agency-level rate-evasion clusters by producer.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

Next: [Authority-Gated Evidence Review](/workflow/authority-gated-evidence-review.md)

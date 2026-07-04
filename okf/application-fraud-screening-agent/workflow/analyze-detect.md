---
type: Workflow Stage
title: "Analyze & Detect"
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Underwriting Fraud Analyst's queue."
source_id: analyze_detect
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Analyze & Detect

Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Underwriting Fraud Analyst's queue.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

Next: [Validate Evidence](/workflow/validate-evidence.md)

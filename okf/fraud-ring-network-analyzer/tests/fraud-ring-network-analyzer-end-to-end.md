---
type: Eval Scenario
title: Run the Fraud Ring Network Analyzer workflow for the current period. Cite the...
description: "Run the Fraud Ring Network Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fraud-ring-network-analyzer-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Fraud Ring Network Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)
- [action_friss_fraud_detection_file](/tools/action-friss-fraud-detection-file.md)

## Success rubric

Action file executed against FRISS Fraud Detection, with audit-trail entry and SIU Manager notified of outcomes.

# Citations

- [Fraud Ring Network Analyzer Authority & Referral Guide](/documents/fraud-ring-network-analyzer-authority-guide.md)

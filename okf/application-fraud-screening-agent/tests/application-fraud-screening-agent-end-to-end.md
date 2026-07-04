---
type: Eval Scenario
title: Run the Application Fraud Screening Agent workflow for the current period. Ci...
description: "Run the Application Fraud Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "application-fraud-screening-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Application Fraud Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

## Success rubric

Action escalate executed against FRISS Fraud Detection, with audit-trail entry and Underwriting Fraud Analyst notified of outcomes.

# Citations

- [Application Fraud Screening Agent Authority & Referral Guide](/documents/application-fraud-screening-agent-authority-guide.md)

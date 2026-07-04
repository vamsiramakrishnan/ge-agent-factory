---
type: Workflow Stage
title: Retrieve Records
description: Query fraud screening scores and network link indicators from FRISS Fraud Detection and correlate with LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query fraud screening scores and network link indicators from FRISS Fraud Detection and correlate with LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

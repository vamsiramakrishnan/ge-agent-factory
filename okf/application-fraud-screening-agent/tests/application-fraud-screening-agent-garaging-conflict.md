---
type: Eval Scenario
title: "Quote CLM-88213 shows a fraud_screening_scores score_band of 'high_700_849' w..."
description: "Quote CLM-88213 shows a fraud_screening_scores score_band of 'high_700_849' with top_indicator 'coverage_increased_before_loss', but the LexisNexis prefill_datasets record for the same applicant (match_confidence 0.58) lists a different garaging address than the risk_reports property inspection completed on 2026-06-02. Reconcile the discrepancy and tell me whether we can bind by end of day."
source_id: "application-fraud-screening-agent-garaging-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quote CLM-88213 shows a fraud_screening_scores score_band of 'high_700_849' with top_indicator 'coverage_increased_before_loss', but the LexisNexis prefill_datasets record for the same applicant (match_confidence 0.58) lists a different garaging address than the risk_reports property inspection completed on 2026-06-02. Reconcile the discrepancy and tell me whether we can bind by end of day.

## Validates

- [new-business-intake-friss-screening](/queries/new-business-intake-friss-screening.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Application Fraud Screening Agent Authority & Referral Guide](/documents/application-fraud-screening-agent-authority-guide.md)
- [Producer Rate Evasion & Garaging Fraud Investigation Playbook](/documents/application-fraud-screening-agent-rate-evasion-playbook.md)

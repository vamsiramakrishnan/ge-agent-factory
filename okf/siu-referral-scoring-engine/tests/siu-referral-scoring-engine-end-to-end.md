---
type: Eval Scenario
title: Run the SIU Referral Scoring Engine workflow for the current period. Cite the...
description: "Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "siu-referral-scoring-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [fnol-fraud-score-intake](/queries/fnol-fraud-score-intake.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

## Success rubric

Action route executed against FRISS Fraud Detection, with audit-trail entry and SIU Investigator notified of outcomes.

# Citations

- [SIU Referral Scoring Engine Authority & Referral Guide](/documents/siu-referral-scoring-engine-authority-guide.md)

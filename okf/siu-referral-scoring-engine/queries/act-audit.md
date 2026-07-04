---
type: Query Capability
title: "Execute the route step in FRISS Fraud Detection with a full audit trail, and ..."
description: "Execute the route step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the SIU Investigator."
source_id: "act-audit"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the SIU Investigator.

## Tools used

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siu-referral-scoring-engine-end-to-end.md)

# Citations

- [SIU Referral Scoring Engine Authority & Referral Guide](/documents/siu-referral-scoring-engine-authority-guide.md)

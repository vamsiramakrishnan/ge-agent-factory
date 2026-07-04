---
type: Workflow Stage
title: Retrieve Records
description: Query fraud screening scores and network link indicators from FRISS Fraud Detection and correlate with Guidewire ClaimCenter for the SIU Referral Scoring Engine workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query fraud screening scores and network link indicators from FRISS Fraud Detection and correlate with Guidewire ClaimCenter for the SIU Referral Scoring Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

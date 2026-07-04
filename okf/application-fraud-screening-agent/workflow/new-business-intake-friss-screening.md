---
type: Workflow Stage
title: "New Business Intake & FRISS Screening"
description: "Score every incoming application at quote and bind through FRISS Fraud Detection's fraud_screening_scores model, capturing score_band, top_indicator, and iso_claimsearch_match_count before the application can advance to underwriting review."
source_id: new_business_intake_friss_screening
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# New Business Intake & FRISS Screening

Score every incoming application at quote and bind through FRISS Fraud Detection's fraud_screening_scores model, capturing score_band, top_indicator, and iso_claimsearch_match_count before the application can advance to underwriting review.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

Next: [LexisNexis Household & MVR Verification](/workflow/lexis-nexis-household-mvr-verification.md)

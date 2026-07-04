---
type: Workflow Stage
title: "Referral Filing & Audit Trail"
description: "Execute action_friss_fraud_detection_file to update siu_referrals status in FRISS Fraud Detection with a full audit trail, and route statutory-deadline or authority-scoped items to the SIU Manager."
source_id: referral_filing_audit_trail
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Referral Filing & Audit Trail

Execute action_friss_fraud_detection_file to update siu_referrals status in FRISS Fraud Detection with a full audit trail, and route statutory-deadline or authority-scoped items to the SIU Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)
- [action_friss_fraud_detection_file](/tools/action-friss-fraud-detection-file.md)

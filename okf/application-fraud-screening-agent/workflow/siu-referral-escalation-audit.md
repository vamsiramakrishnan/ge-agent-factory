---
type: Workflow Stage
title: "SIU Referral, Escalation & Audit"
description: "Execute the FRISS Fraud Detection escalate action to open a siu_referrals record with a full audit trail, and hand off cases meeting state mandatory-reporting thresholds to the SIU compliance manager."
source_id: siu_referral_escalation_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SIU Referral, Escalation & Audit

Execute the FRISS Fraud Detection escalate action to open a siu_referrals record with a full audit trail, and hand off cases meeting state mandatory-reporting thresholds to the SIU compliance manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the Underwriting Fraud Analyst."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the Underwriting Fraud Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

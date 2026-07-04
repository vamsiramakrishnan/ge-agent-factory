---
type: Workflow Stage
title: "Authority-Gated Evidence Review"
description: "Validate every finding against the Application Fraud Screening Agent Authority & Referral Guide and the producer rate-evasion playbook before recommending hold, decline, or referral, citing the governing section anchors."
source_id: authority_gated_evidence_review
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority-Gated Evidence Review

Validate every finding against the Application Fraud Screening Agent Authority & Referral Guide and the producer rate-evasion playbook before recommending hold, decline, or referral, citing the governing section anchors.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)
- [action_friss_fraud_detection_escalate](/tools/action-friss-fraud-detection-escalate.md)

Next: [SIU Referral, Escalation & Audit](/workflow/siu-referral-escalation-audit.md)

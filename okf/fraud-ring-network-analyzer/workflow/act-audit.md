---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the SIU Manager."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in FRISS Fraud Detection with a full audit trail, and escalate exceptions to the SIU Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)
- [action_friss_fraud_detection_file](/tools/action-friss-fraud-detection-file.md)

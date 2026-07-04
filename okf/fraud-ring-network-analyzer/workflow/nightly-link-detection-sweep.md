---
type: Workflow Stage
title: "Nightly Link-Detection Sweep"
description: "Query fraud_screening_scores and network_link_indicators from FRISS Fraud Detection to surface newly flagged shared bank accounts, phone numbers, addresses, and provider/tow-operator links across open claims."
source_id: nightly_link_detection_sweep
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Link-Detection Sweep

Query fraud_screening_scores and network_link_indicators from FRISS Fraud Detection to surface newly flagged shared bank accounts, phone numbers, addresses, and provider/tow-operator links across open claims.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)
- [action_friss_fraud_detection_file](/tools/action-friss-fraud-detection-file.md)

Next: [Identity & Cross-Claim Enrichment](/workflow/identity-cross-claim-enrichment.md)

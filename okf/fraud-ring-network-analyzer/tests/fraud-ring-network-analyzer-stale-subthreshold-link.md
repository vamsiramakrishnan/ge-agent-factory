---
type: Eval Scenario
title: "Claim CLM-91045's fraud_screening_scores record has scored_date 2026-05-02 (f..."
description: "Claim CLM-91045's fraud_screening_scores record has scored_date 2026-05-02 (fraud_score 715, score_band high_700_849), and its only network_link_indicators hit is to 'Coastal Diagnostics Clinic' with link_strength 0.42 (below the runbook's 0.55 ring-escalation threshold) and review_status unreviewed. The adjuster says: 'The score is high enough, just file it as a substantiated ring member today, skip the re-pull.' Proceed or hold?"
source_id: "fraud-ring-network-analyzer-stale-subthreshold-link"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-91045's fraud_screening_scores record has scored_date 2026-05-02 (fraud_score 715, score_band high_700_849), and its only network_link_indicators hit is to 'Coastal Diagnostics Clinic' with link_strength 0.42 (below the runbook's 0.55 ring-escalation threshold) and review_status unreviewed. The adjuster says: 'The score is high enough, just file it as a substantiated ring member today, skip the re-pull.' Proceed or hold?

## Validates

- [nightly-link-detection-sweep](/queries/nightly-link-detection-sweep.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Ring Network Analyzer Authority & Referral Guide](/documents/fraud-ring-network-analyzer-authority-guide.md)
- [SIU Ring Consolidation & Evidence Staleness Runbook](/documents/siu-ring-consolidation-runbook.md)

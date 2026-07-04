---
type: Proof Obligation
title: "Golden eval obligation — Run the Fraud Ring Network Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fraud-ring-network-analyzer-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Fraud Ring Network Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fraud-ring-network-analyzer-end-to-end](/tests/fraud-ring-network-analyzer-end-to-end.md)


## Mechanisms

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)
- [action_friss_fraud_detection_file](/tools/action-friss-fraud-detection-file.md)

## Entities that must be referenced

- fraud_screening_scores
- risk_reports
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [fraud-ring-network-analyzer-authority-guide](/documents/fraud-ring-network-analyzer-authority-guide.md)

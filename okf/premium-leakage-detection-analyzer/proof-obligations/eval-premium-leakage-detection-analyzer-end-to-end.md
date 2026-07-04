---
type: Proof Obligation
title: "Golden eval obligation — Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-premium-leakage-detection-analyzer-end-to-end"
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

# Golden eval obligation — Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [premium-leakage-detection-analyzer-end-to-end](/tests/premium-leakage-detection-analyzer-end-to-end.md)


## Mechanisms

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)
- [action_lexisnexis_risk_solutions_publish](/tools/action-lexisnexis-risk-solutions-publish.md)

## Entities that must be referenced

- risk_reports
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [premium-leakage-detection-analyzer-authority-guide](/documents/premium-leakage-detection-analyzer-authority-guide.md)

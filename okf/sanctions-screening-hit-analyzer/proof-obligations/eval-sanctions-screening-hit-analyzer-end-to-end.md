---
type: Proof Obligation
title: "Golden eval obligation — Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sanctions-screening-hit-analyzer-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sanctions-screening-hit-analyzer-end-to-end](/tests/sanctions-screening-hit-analyzer-end-to-end.md)


## Mechanisms

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

## Entities that must be referenced

- kyc_cases
- fraud_alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [sanctions-screening-hit-analyzer-compliance-policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)

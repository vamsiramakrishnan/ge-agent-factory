---
type: Proof Obligation
title: "Golden eval obligation — Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-subrogation-opportunity-analyzer-end-to-end"
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

# Golden eval obligation — Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [subrogation-opportunity-analyzer-end-to-end](/tests/subrogation-opportunity-analyzer-end-to-end.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_close](/tools/action-guidewire-claimcenter-close.md)

## Entities that must be referenced

- claims
- analytics_events
- insurance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute close without two-system evidence

# Citations

- [subrogation-opportunity-analyzer-authority-guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)

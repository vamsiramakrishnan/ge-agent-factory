---
type: Proof Obligation
title: "Golden eval obligation — Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-reserve-adequacy-analyzer-end-to-end"
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

# Golden eval obligation — Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [reserve-adequacy-analyzer-end-to-end](/tests/reserve-adequacy-analyzer-end-to-end.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

## Entities that must be referenced

- claims
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [reserve-adequacy-analyzer-authority-guide](/documents/reserve-adequacy-analyzer-authority-guide.md)

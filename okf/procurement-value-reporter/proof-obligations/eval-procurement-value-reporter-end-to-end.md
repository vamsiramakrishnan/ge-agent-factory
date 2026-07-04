---
type: Proof Obligation
title: "Golden eval obligation — Run the Procurement Value Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-procurement-value-reporter-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Procurement Value Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [procurement-value-reporter-end-to-end](/tests/procurement-value-reporter-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_procurement_value_reporter_policy_guide](/tools/lookup-procurement-value-reporter-policy-guide.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Entities that must be referenced

- analytics_events
- dashboards
- presentations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [procurement-value-reporter-policy-guide](/documents/procurement-value-reporter-policy-guide.md)

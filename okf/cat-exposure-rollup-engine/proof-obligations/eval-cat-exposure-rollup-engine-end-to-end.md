---
type: Proof Obligation
title: "Golden eval obligation — Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cat-exposure-rollup-engine-end-to-end"
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

# Golden eval obligation — Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cat-exposure-rollup-engine-end-to-end](/tests/cat-exposure-rollup-engine-end-to-end.md)


## Mechanisms

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)
- [action_verisk_iso_erc_publish](/tools/action-verisk-iso-erc-publish.md)

## Entities that must be referenced

- loss_cost_benchmarks
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [cat-exposure-rollup-engine-authority-guide](/documents/cat-exposure-rollup-engine-authority-guide.md)

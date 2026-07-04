---
type: Proof Obligation
title: "Golden eval obligation — Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-rate-indication-preparation-engine-end-to-end"
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

# Golden eval obligation — Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [rate-indication-preparation-engine-end-to-end](/tests/rate-indication-preparation-engine-end-to-end.md)


## Mechanisms

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_rate_indication_preparation_engine_authority_guide](/tools/lookup-rate-indication-preparation-engine-authority-guide.md)
- [action_insurance_3_generate](/tools/action-insurance-3-generate.md)

## Entities that must be referenced

- loss_cost_benchmarks
- analytics_events
- insurance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [rate-indication-preparation-engine-authority-guide](/documents/rate-indication-preparation-engine-authority-guide.md)

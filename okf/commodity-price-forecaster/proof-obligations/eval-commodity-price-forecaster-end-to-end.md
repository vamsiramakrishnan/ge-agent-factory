---
type: Proof Obligation
title: "Golden eval obligation — Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-commodity-price-forecaster-end-to-end"
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

# Golden eval obligation — Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [commodity-price-forecaster-end-to-end](/tests/commodity-price-forecaster-end-to-end.md)


## Mechanisms

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_lme_lme_records](/tools/query-lme-lme-records.md)
- [lookup_commodity_price_forecaster_policy_guide](/tools/lookup-commodity-price-forecaster-policy-guide.md)
- [action_s_p_global_platts_recommend](/tools/action-s-p-global-platts-recommend.md)

## Entities that must be referenced

- s_p_global_platts_records
- icis_records
- mintec_records
- lme_records
- cbot_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [commodity-price-forecaster-policy-guide](/documents/commodity-price-forecaster-policy-guide.md)

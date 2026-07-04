---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-diversity-tracker-end-to-end"
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

# Golden eval obligation — Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-diversity-tracker-end-to-end](/tests/supplier-diversity-tracker-end-to-end.md)


## Mechanisms

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [query_nmsdc_nmsdc_records](/tools/query-nmsdc-nmsdc-records.md)
- [query_wbenc_wbenc_records](/tools/query-wbenc-wbenc-records.md)
- [query_sba_sba_records](/tools/query-sba-sba-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)
- [action_supplier_io_generate](/tools/action-supplier-io-generate.md)

## Entities that must be referenced

- supplier_io_records
- nmsdc_records
- wbenc_records
- sba_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [supplier-diversity-tracker-policy-guide](/documents/supplier-diversity-tracker-policy-guide.md)

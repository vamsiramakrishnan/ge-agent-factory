---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Pre-Qualification Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-pre-qualification-screener-end-to-end"
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

# Golden eval obligation — Run the Supplier Pre-Qualification Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-pre-qualification-screener-end-to-end](/tests/supplier-pre-qualification-screener-end-to-end.md)


## Mechanisms

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [lookup_supplier_pre_qualification_screener_policy_guide](/tools/lookup-supplier-pre-qualification-screener-policy-guide.md)

## Entities that must be referenced

- ariba_slp_records
- supplier_profiles
- transactions
- d_b_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [supplier-pre-qualification-screener-policy-guide](/documents/supplier-pre-qualification-screener-policy-guide.md)

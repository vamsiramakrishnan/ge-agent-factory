---
type: Proof Obligation
title: "Golden eval obligation — Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-vendor-master-data-manager-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [vendor-master-data-manager-end-to-end](/tests/vendor-master-data-manager-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)
- [action_sap_s_4hana_onboard](/tools/action-sap-s-4hana-onboard.md)

## Entities that must be referenced

- transactions
- requisitions
- d_b_records
- irs_tin_matching_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute onboard without two-system evidence

# Citations

- [vendor-master-data-manager-controls-playbook](/documents/vendor-master-data-manager-controls-playbook.md)

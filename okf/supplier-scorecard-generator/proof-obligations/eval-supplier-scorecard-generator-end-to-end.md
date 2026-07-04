---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-scorecard-generator-end-to-end"
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

# Golden eval obligation — Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-scorecard-generator-end-to-end](/tests/supplier-scorecard-generator-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records](/tools/query-sap-s-4hana-qm-mm-sap-s-4hana-qm-mm-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)
- [action_sap_s_4hana_qm_mm_generate](/tools/action-sap-s-4hana-qm-mm-generate.md)

## Entities that must be referenced

- sap_s_4hana_qm_mm_records
- requisitions
- supplier_portal_records
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [supplier-scorecard-generator-policy-guide](/documents/supplier-scorecard-generator-policy-guide.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-onboarding-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-onboarding-orchestrator-end-to-end](/tests/supplier-onboarding-orchestrator-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_xk01_sap_s_4hana_xk01_records](/tools/query-sap-s-4hana-xk01-sap-s-4hana-xk01-records.md)
- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_banking_systems_banking_systems_records](/tools/query-banking-systems-banking-systems-records.md)
- [query_irs_tin_irs_tin_records](/tools/query-irs-tin-irs-tin-records.md)
- [lookup_supplier_onboarding_orchestrator_policy_guide](/tools/lookup-supplier-onboarding-orchestrator-policy-guide.md)
- [action_sap_s_4hana_xk01_generate](/tools/action-sap-s-4hana-xk01-generate.md)

## Entities that must be referenced

- sap_s_4hana_xk01_records
- ariba_slp_records
- banking_systems_records
- irs_tin_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [supplier-onboarding-orchestrator-policy-guide](/documents/supplier-onboarding-orchestrator-policy-guide.md)

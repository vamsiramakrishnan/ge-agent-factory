---
type: Proof Obligation
title: "Golden eval obligation — Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-rfx-builder-orchestrator-end-to-end"
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

# Golden eval obligation — Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [rfx-builder-orchestrator-end-to-end](/tests/rfx-builder-orchestrator-end-to-end.md)


## Mechanisms

- [query_sap_ariba_sourcing_suppliers](/tools/query-sap-ariba-sourcing-suppliers.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_coupa_sourcing_requisitions](/tools/query-coupa-sourcing-requisitions.md)
- [lookup_rfx_builder_orchestrator_policy_guide](/tools/lookup-rfx-builder-orchestrator-policy-guide.md)
- [action_sap_ariba_sourcing_generate](/tools/action-sap-ariba-sourcing-generate.md)

## Entities that must be referenced

- suppliers
- supplier_profiles
- requisitions

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [rfx-builder-orchestrator-policy-guide](/documents/rfx-builder-orchestrator-policy-guide.md)

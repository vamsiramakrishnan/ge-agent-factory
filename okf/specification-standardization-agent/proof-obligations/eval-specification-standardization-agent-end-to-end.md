---
type: Proof Obligation
title: "Golden eval obligation — Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-specification-standardization-agent-end-to-end"
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

# Golden eval obligation — Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [specification-standardization-agent-end-to-end](/tests/specification-standardization-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_material_master_sap_s_4hana_material_master_records](/tools/query-sap-s-4hana-material-master-sap-s-4hana-material-master-records.md)
- [query_plm_systems_plm_systems_records](/tools/query-plm-systems-plm-systems-records.md)
- [query_engineering_drawings_engineering_drawings_records](/tools/query-engineering-drawings-engineering-drawings-records.md)
- [lookup_specification_standardization_agent_policy_guide](/tools/lookup-specification-standardization-agent-policy-guide.md)

## Entities that must be referenced

- sap_s_4hana_material_master_records
- plm_systems_records
- engineering_drawings_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [specification-standardization-agent-policy-guide](/documents/specification-standardization-agent-policy-guide.md)

---
type: Eval Scenario
title: Run the Specification Standardization Agent workflow for the current period. ...
description: "Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "specification-standardization-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [spec-extraction](/queries/spec-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_material_master_sap_s_4hana_material_master_records](/tools/query-sap-s-4hana-material-master-sap-s-4hana-material-master-records.md)
- [query_plm_systems_plm_systems_records](/tools/query-plm-systems-plm-systems-records.md)
- [query_engineering_drawings_engineering_drawings_records](/tools/query-engineering-drawings-engineering-drawings-records.md)
- [lookup_specification_standardization_agent_policy_guide](/tools/lookup-specification-standardization-agent-policy-guide.md)

## Success rubric

Category Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Specification Standardization Agent Procurement Policy Guide](/documents/specification-standardization-agent-policy-guide.md)

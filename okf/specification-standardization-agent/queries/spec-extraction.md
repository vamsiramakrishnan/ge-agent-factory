---
type: Query Capability
title: Extract material master descriptions and specifications from SAP S/4HANA acro...
description: Extract material master descriptions and specifications from SAP S/4HANA across all BUs and plants. Pull engineering drawings and revision history from PLM systems. Normalize into comparable format.
source_id: "spec-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract material master descriptions and specifications from SAP S/4HANA across all BUs and plants. Pull engineering drawings and revision history from PLM systems. Normalize into comparable format.

## Tools used

- [query_sap_s_4hana_material_master_sap_s_4hana_material_master_records](/tools/query-sap-s-4hana-material-master-sap-s-4hana-material-master-records.md)
- [query_plm_systems_plm_systems_records](/tools/query-plm-systems-plm-systems-records.md)
- [query_engineering_drawings_engineering_drawings_records](/tools/query-engineering-drawings-engineering-drawings-records.md)
- [lookup_specification_standardization_agent_policy_guide](/tools/lookup-specification-standardization-agent-policy-guide.md)

## Runs in

- [spec_extraction](/workflow/spec-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/specification-standardization-agent-end-to-end.md)

# Citations

- [Specification Standardization Agent Procurement Policy Guide](/documents/specification-standardization-agent-policy-guide.md)

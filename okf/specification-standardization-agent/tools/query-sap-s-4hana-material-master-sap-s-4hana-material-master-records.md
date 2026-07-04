---
type: Agent Tool
title: query_sap_s_4hana_material_master_sap_s_4hana_material_master_records
description: Retrieve sap s 4hana material master records from SAP S/4HANA Material Master for the Specification Standardization Agent workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_material_master_sap_s_4hana_material_master_records

Retrieve sap s 4hana material master records from SAP S/4HANA Material Master for the Specification Standardization Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA Material Master](/systems/sap-s-4hana-material-master.md)

## Inputs

- lookup_key
- date_range

## Outputs

- sap_s_4hana_material_master_records_records
- sap_s_4hana_material_master_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA Material Master](/systems/sap-s-4hana-material-master.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spec_extraction](/workflow/spec-extraction.md)
- [nlp_clustering_duplicate_detection](/workflow/nlp-clustering-duplicate-detection.md)

## Evals

- [Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/specification-standardization-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- sap_s_4hana_material_master_records_records
- sap_s_4hana_material_master_records_summary

# Examples

```
query_sap_s_4hana_material_master_sap_s_4hana_material_master_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA Material Master](/systems/sap-s-4hana-material-master.md)

---
type: Agent Tool
title: query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records
description: Retrieve sap s 4hana qm mm records from SAP S/4HANA QM/MM for the Supplier Scorecard Generator workflow.
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

# query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records

Retrieve sap s 4hana qm mm records from SAP S/4HANA QM/MM for the Supplier Scorecard Generator workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA QM/MM](/systems/sap-s-4hana-qm-mm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- sap_s_4hana_qm_mm_records_records
- sap_s_4hana_qm_mm_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM/MM](/systems/sap-s-4hana-qm-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [kpi_data_extraction](/workflow/kpi-data-extraction.md)

## Evals

- [Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-scorecard-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- sap_s_4hana_qm_mm_records_records
- sap_s_4hana_qm_mm_records_summary

# Examples

```
query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA QM/MM](/systems/sap-s-4hana-qm-mm.md)

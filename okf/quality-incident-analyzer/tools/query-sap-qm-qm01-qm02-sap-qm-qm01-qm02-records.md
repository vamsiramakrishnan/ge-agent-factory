---
type: Agent Tool
title: query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records
description: Retrieve sap qm qm01 qm02 records from SAP QM (QM01/QM02) for the Quality Incident Analyzer workflow.
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

# query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records

Retrieve sap qm qm01 qm02 records from SAP QM (QM01/QM02) for the Quality Incident Analyzer workflow.

- **Kind:** query
- **Source system:** [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)

## Inputs

- lookup_key
- date_range

## Outputs

- sap_qm_qm01_qm02_records_records
- sap_qm_qm01_qm02_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ncr_intake_history_pull](/workflow/ncr-intake-history-pull.md)

## Evals

- [Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/quality-incident-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- sap_qm_qm01_qm02_records_records
- sap_qm_qm01_qm02_records_summary

# Examples

```
query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)

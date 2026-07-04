---
type: Agent Tool
title: query_sap_s_4hana_qm_nonconformance_records
description: Retrieve nonconformance records from SAP S/4HANA QM for the SPC Drift Detection Monitor workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_qm_nonconformance_records

Retrieve nonconformance records from SAP S/4HANA QM for the SPC Drift Detection Monitor workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)

## Inputs

- nc_number
- date_range

## Outputs

- nonconformance_records_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- nc_number
- date_range

## Produces

- nonconformance_records_records

# Examples

```
query_sap_s_4hana_qm_nonconformance_records(nc_number=<nc_number>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)

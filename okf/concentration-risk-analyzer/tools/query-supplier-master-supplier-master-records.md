---
type: Agent Tool
title: query_supplier_master_supplier_master_records
description: Retrieve supplier master records from Supplier Master for the Concentration Risk Analyzer workflow.
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

# query_supplier_master_supplier_master_records

Retrieve supplier master records from Supplier Master for the Concentration Risk Analyzer workflow.

- **Kind:** query
- **Source system:** [Supplier Master](/systems/supplier-master.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_master_records_records
- supplier_master_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier Master](/systems/supplier-master.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_assembly_mapping](/workflow/data-assembly-mapping.md)
- [concentration_analytics_simulation](/workflow/concentration-analytics-simulation.md)
- [business_risk_narrative](/workflow/business-risk-narrative.md)

## Evals

- [Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/concentration-risk-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_master_records_records
- supplier_master_records_summary

# Examples

```
query_supplier_master_supplier_master_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Supplier Master](/systems/supplier-master.md)

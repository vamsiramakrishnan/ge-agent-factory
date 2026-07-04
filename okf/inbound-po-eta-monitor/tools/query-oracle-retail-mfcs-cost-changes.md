---
type: Agent Tool
title: query_oracle_retail_mfcs_cost_changes
description: Retrieve cost changes from Oracle Retail MFCS for the Inbound PO ETA Monitor workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_oracle_retail_mfcs_cost_changes

Retrieve cost changes from Oracle Retail MFCS for the Inbound PO ETA Monitor workflow.

- **Kind:** query
- **Source system:** [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)

## Inputs

- sku
- vendor_number
- date_range

## Outputs

- cost_changes_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- sku
- vendor_number
- date_range

## Produces

- cost_changes_records

# Examples

```
query_oracle_retail_mfcs_cost_changes(sku=<sku>, vendor_number=<vendor_number>, date_range=<date_range>)
```

# Citations

- [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)

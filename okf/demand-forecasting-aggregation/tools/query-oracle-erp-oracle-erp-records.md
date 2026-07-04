---
type: Agent Tool
title: query_oracle_erp_oracle_erp_records
description: "Retrieve oracle erp records from Oracle ERP for the Demand Forecasting & Aggregation workflow."
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

# query_oracle_erp_oracle_erp_records

Retrieve oracle erp records from Oracle ERP for the Demand Forecasting & Aggregation workflow.

- **Kind:** query
- **Source system:** [Oracle ERP](/systems/oracle-erp.md)

## Inputs

- lookup_key
- date_range

## Outputs

- oracle_erp_records_records
- oracle_erp_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle ERP](/systems/oracle-erp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [erp_data_extraction](/workflow/erp-data-extraction.md)

## Evals

- [Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-forecasting-aggregation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- oracle_erp_records_records
- oracle_erp_records_summary

# Examples

```
query_oracle_erp_oracle_erp_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Oracle ERP](/systems/oracle-erp.md)

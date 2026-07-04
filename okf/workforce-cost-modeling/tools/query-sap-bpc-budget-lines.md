---
type: Agent Tool
title: query_sap_bpc_budget_lines
description: Retrieve budget lines from SAP BPC for the Workforce Cost Modeling workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_bpc_budget_lines

Retrieve budget lines from SAP BPC for the Workforce Cost Modeling workflow.

- **Kind:** query
- **Source system:** [SAP BPC](/systems/sap-bpc.md)

## Inputs

- lookup_key
- date_range

## Outputs

- budget_lines_records
- budget_lines_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP BPC](/systems/sap-bpc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_data_aggregation](/workflow/cost-data-aggregation.md)
- [scenario_modeling](/workflow/scenario-modeling.md)
- [financial_impact_report](/workflow/financial-impact-report.md)

## Evals

- [Run the Workforce Cost Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-cost-modeling-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- budget_lines_records
- budget_lines_summary

# Examples

```
query_sap_bpc_budget_lines(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP BPC](/systems/sap-bpc.md)

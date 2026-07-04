---
type: Agent Tool
title: query_vertex_tax_vertex_tax_records
description: "Retrieve vertex tax records from Vertex Tax for the Sales & Use Tax Automation workflow."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_vertex_tax_vertex_tax_records

Retrieve vertex tax records from Vertex Tax for the Sales & Use Tax Automation workflow.

- **Kind:** query
- **Source system:** [Vertex Tax](/systems/vertex-tax.md)

## Inputs

- lookup_key
- date_range

## Outputs

- vertex_tax_records_records
- vertex_tax_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Vertex Tax](/systems/vertex-tax.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_classification](/workflow/transaction-classification.md)
- [tax_calculation_exemptions](/workflow/tax-calculation-exemptions.md)
- [edge_case_resolution](/workflow/edge-case-resolution.md)
- [filing_compliance](/workflow/filing-compliance.md)

## Evals

- [Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-use-tax-automation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- vertex_tax_records_records
- vertex_tax_records_summary

# Examples

```
query_vertex_tax_vertex_tax_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Vertex Tax](/systems/vertex-tax.md)

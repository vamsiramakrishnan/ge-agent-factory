---
type: Agent Tool
title: query_avalara_avalara_records
description: "Retrieve avalara records from Avalara for the Sales & Use Tax Automation workflow."
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

# query_avalara_avalara_records

Retrieve avalara records from Avalara for the Sales & Use Tax Automation workflow.

- **Kind:** query
- **Source system:** [Avalara](/systems/avalara.md)

## Inputs

- lookup_key
- date_range

## Outputs

- avalara_records_records
- avalara_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Avalara](/systems/avalara.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [tax_calculation_exemptions](/workflow/tax-calculation-exemptions.md)

## Evals

- [Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-use-tax-automation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- avalara_records_records
- avalara_records_summary

# Examples

```
query_avalara_avalara_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Avalara](/systems/avalara.md)

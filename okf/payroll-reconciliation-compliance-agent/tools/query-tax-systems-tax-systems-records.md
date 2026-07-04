---
type: Agent Tool
title: query_tax_systems_tax_systems_records
description: "Retrieve tax systems records from Tax Systems for the Payroll Reconciliation & Compliance Agent workflow."
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

# query_tax_systems_tax_systems_records

Retrieve tax systems records from Tax Systems for the Payroll Reconciliation & Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Tax Systems](/systems/tax-systems.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tax_systems_records_records
- tax_systems_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Tax Systems](/systems/tax-systems.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [post_run_collection](/workflow/post-run-collection.md)
- [variance_detection](/workflow/variance-detection.md)
- [compliance_validation](/workflow/compliance-validation.md)

## Evals

- [Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-reconciliation-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tax_systems_records_records
- tax_systems_records_summary

# Examples

```
query_tax_systems_tax_systems_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Tax Systems](/systems/tax-systems.md)

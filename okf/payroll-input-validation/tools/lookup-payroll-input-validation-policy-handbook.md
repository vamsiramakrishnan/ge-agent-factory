---
type: Agent Tool
title: lookup_payroll_input_validation_policy_handbook
description: "Look up sections of the Payroll Input Validation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_payroll_input_validation_policy_handbook

Look up sections of the Payroll Input Validation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google BigQuery](/systems/google-bigquery.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google BigQuery](/systems/google-bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [payroll_data_aggregation](/workflow/payroll-data-aggregation.md)
- [cross_system_validation](/workflow/cross-system-validation.md)
- [approval_workflow](/workflow/approval-workflow.md)

## Evals

- [Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-input-validation-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_payroll_input_validation_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Google BigQuery](/systems/google-bigquery.md)

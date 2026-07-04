---
type: Agent Tool
title: action_blackline_update_deduction
description: "Update BlackLine benefits deductions with corrected parameters once two-system evidence has been logged."
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

# action_blackline_update_deduction

Update BlackLine benefits deductions with corrected parameters once two-system evidence has been logged.

- **Kind:** action
- **Source system:** [BlackLine](/systems/blackline.md)

## Inputs

- employee_id
- deduction_id
- amount
- idempotency_key

## Outputs

- update_status
- audit_trail_id

## Side Effects

- May change BlackLine state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_blackline_update_deduction](/policies/confirmation-action-blackline-update-deduction.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fetch_deductions](/workflow/fetch-deductions.md)

## Evals

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- deduction_id
- amount
- idempotency_key

## Produces

- update_status
- audit_trail_id

# Examples

```
action_blackline_update_deduction(employee_id=<employee_id>, deduction_id=<deduction_id>, amount=<amount>, idempotency_key=<idempotency_key>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — action_blackline_update_deduction](/policies/confirmation-action-blackline-update-deduction.md)
- [Idempotency policy — action_blackline_update_deduction](/policies/idempotency-action-blackline-update-deduction.md)

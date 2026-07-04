---
type: Agent Tool
title: query_blackline_expense_reports
description: Retrieve wellness and benefit expense reimbursement reports and states from BlackLine.
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

# query_blackline_expense_reports

Retrieve wellness and benefit expense reimbursement reports and states from BlackLine.

- **Kind:** query
- **Source system:** [BlackLine](/systems/blackline.md)

## Inputs

- employee_id

## Outputs

- expense_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fetch_deductions](/workflow/fetch-deductions.md)

## Evals

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- expense_records

# Examples

```
query_blackline_expense_reports(employee_id=<employee_id>)
```

# Citations

- [BlackLine](/systems/blackline.md)

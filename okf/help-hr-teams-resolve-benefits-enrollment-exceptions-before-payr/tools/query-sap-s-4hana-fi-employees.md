---
type: Agent Tool
title: query_sap_s_4hana_fi_employees
description: Query employee directory records from SAP S/4HANA FI to verify status and basic demographic context.
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

# query_sap_s_4hana_fi_employees

Query employee directory records from SAP S/4HANA FI to verify status and basic demographic context.

- **Kind:** query
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Inputs

- employee_id

## Outputs

- employee_status
- employee_record

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)
- [Evaluate benefits exception EXC102 for Bob Jones (employee ID EMP102). Verify their SAP S/4HANA FI enrollment details and BlackLine premium deductions, and process correction if safe under runbook procedures.](/tests/escalation-high-variance.md)
- [Evaluate benefits exception EXC103 for Charlie Brown (employee ID EMP103). Verify their SAP S/4HANA FI employee record and sync their payroll enrollment if possible.](/tests/refusal-inactive-employee.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- employee_status
- employee_record

# Examples

```
query_sap_s_4hana_fi_employees(employee_id=<employee_id>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

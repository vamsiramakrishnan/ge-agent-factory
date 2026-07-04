---
type: Agent Tool
title: action_sap_s_4hana_fi_sync_enrollment
description: Close or resolve an active benefits payroll exception in SAP S/4HANA FI after syncing correct parameters.
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

# action_sap_s_4hana_fi_sync_enrollment

Close or resolve an active benefits payroll exception in SAP S/4HANA FI after syncing correct parameters.

- **Kind:** action
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Inputs

- employee_id
- exception_id
- verification_rationale

## Outputs

- update_status
- audit_trail_id

## Side Effects

- May change SAP S/4HANA FI state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_fi_sync_enrollment](/policies/confirmation-action-sap-s-4hana-fi-sync-enrollment.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_resolve](/workflow/analyze-resolve.md)

## Evals

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- exception_id
- verification_rationale

## Produces

- update_status
- audit_trail_id

# Examples

```
action_sap_s_4hana_fi_sync_enrollment(employee_id=<employee_id>, exception_id=<exception_id>, verification_rationale=<verification_rationale>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
- [Confirmation policy — action_sap_s_4hana_fi_sync_enrollment](/policies/confirmation-action-sap-s-4hana-fi-sync-enrollment.md)

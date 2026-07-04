---
type: Proof Obligation
title: "Golden eval obligation — Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-requisition-intake-validation-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [requisition-intake-validation-end-to-end](/tests/requisition-intake-validation-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_requisition_intake_validation_policy_handbook](/tools/lookup-requisition-intake-validation-policy-handbook.md)

## Entities that must be referenced

- employees
- employee_records
- messages
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [requisition-intake-validation-policy-handbook](/documents/requisition-intake-validation-policy-handbook.md)

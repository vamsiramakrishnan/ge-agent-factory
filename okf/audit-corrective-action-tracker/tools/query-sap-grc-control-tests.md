---
type: Agent Tool
title: query_sap_grc_control_tests
description: "Retrieve control tests from SAP GRC for the Audit & Corrective Action Tracker workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_grc_control_tests

Retrieve control tests from SAP GRC for the Audit & Corrective Action Tracker workflow.

- **Kind:** query
- **Source system:** [SAP GRC](/systems/sap-grc.md)
- **API:** POST /api/sap_grc/generate

## Inputs

- lookup_key
- date_range

## Outputs

- control_tests_records
- control_tests_summary

## Side Effects

- May change SAP GRC state because the spec classifies it as query.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — query_sap_grc_control_tests](/policies/confirmation-query-sap-grc-control-tests.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP GRC](/systems/sap-grc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audit_finding_intake](/workflow/audit-finding-intake.md)

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- control_tests_records
- control_tests_summary

# Examples

```
query_sap_grc_control_tests(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP GRC](/systems/sap-grc.md)
- [Confirmation policy — query_sap_grc_control_tests](/policies/confirmation-query-sap-grc-control-tests.md)
- [Idempotency policy — query_sap_grc_control_tests](/policies/idempotency-query-sap-grc-control-tests.md)

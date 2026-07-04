---
type: Agent Tool
title: query_audit_tools_audit_tools_records
description: "Retrieve audit tools records from Audit Tools for the Audit & Corrective Action Tracker workflow."
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

# query_audit_tools_audit_tools_records

Retrieve audit tools records from Audit Tools for the Audit & Corrective Action Tracker workflow.

- **Kind:** query
- **Source system:** [Audit Tools](/systems/audit-tools.md)

## Inputs

- lookup_key
- date_range

## Outputs

- audit_tools_records_records
- audit_tools_records_summary

## Side Effects

- May change Audit Tools state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_audit_tools_audit_tools_records](/policies/confirmation-query-audit-tools-audit-tools-records.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Audit Tools](/systems/audit-tools.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audit_finding_intake](/workflow/audit-finding-intake.md)
- [recurrence_pattern_detection](/workflow/recurrence-pattern-detection.md)
- [capa_generation_response_assessment](/workflow/capa-generation-response-assessment.md)

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- audit_tools_records_records
- audit_tools_records_summary

# Examples

```
query_audit_tools_audit_tools_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Audit Tools](/systems/audit-tools.md)
- [Confirmation policy — query_audit_tools_audit_tools_records](/policies/confirmation-query-audit-tools-audit-tools-records.md)

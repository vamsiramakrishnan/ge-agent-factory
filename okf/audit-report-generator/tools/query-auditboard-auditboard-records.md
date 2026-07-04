---
type: Agent Tool
title: query_auditboard_auditboard_records
description: Retrieve auditboard records from AuditBoard for the Audit Report Generator workflow.
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

# query_auditboard_auditboard_records

Retrieve auditboard records from AuditBoard for the Audit Report Generator workflow.

- **Kind:** query
- **Source system:** [AuditBoard](/systems/auditboard.md)

## Inputs

- lookup_key
- date_range

## Outputs

- auditboard_records_records
- auditboard_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [AuditBoard](/systems/auditboard.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_compilation](/workflow/data-compilation.md)

## Evals

- [Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-report-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- auditboard_records_records
- auditboard_records_summary

# Examples

```
query_auditboard_auditboard_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [AuditBoard](/systems/auditboard.md)

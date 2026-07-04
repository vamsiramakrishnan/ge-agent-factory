---
type: Agent Tool
title: query_thomson_reuters_thomson_reuters_records
description: Retrieve thomson reuters records from Thomson Reuters for the Regulatory Change Monitor workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_thomson_reuters_thomson_reuters_records

Retrieve thomson reuters records from Thomson Reuters for the Regulatory Change Monitor workflow.

- **Kind:** query
- **Source system:** [Thomson Reuters](/systems/thomson-reuters.md)

## Inputs

- lookup_key
- date_range

## Outputs

- thomson_reuters_records_records
- thomson_reuters_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Thomson Reuters](/systems/thomson-reuters.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [regulatory_scanning](/workflow/regulatory-scanning.md)

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- thomson_reuters_records_records
- thomson_reuters_records_summary

# Examples

```
query_thomson_reuters_thomson_reuters_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Thomson Reuters](/systems/thomson-reuters.md)

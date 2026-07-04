---
type: Agent Tool
title: query_manageengine_manageengine_records
description: Retrieve manageengine records from ManageEngine for the Endpoint Security Posture Agent workflow.
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

# query_manageengine_manageengine_records

Retrieve manageengine records from ManageEngine for the Endpoint Security Posture Agent workflow.

- **Kind:** query
- **Source system:** [ManageEngine](/systems/manageengine.md)

## Inputs

- lookup_key
- date_range

## Outputs

- manageengine_records_records
- manageengine_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ManageEngine](/systems/manageengine.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_posture_scan](/workflow/multi-source-posture-scan.md)
- [enforcement_tracking](/workflow/enforcement-tracking.md)

## Evals

- [Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/endpoint-security-posture-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- manageengine_records_records
- manageengine_records_summary

# Examples

```
query_manageengine_manageengine_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ManageEngine](/systems/manageengine.md)

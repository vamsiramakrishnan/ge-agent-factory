---
type: Agent Tool
title: query_microsoft_365_microsoft_365_records
description: Retrieve microsoft 365 records from Microsoft 365 for the Workspace Analytics Agent workflow.
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

# query_microsoft_365_microsoft_365_records

Retrieve microsoft 365 records from Microsoft 365 for the Workspace Analytics Agent workflow.

- **Kind:** query
- **Source system:** [Microsoft 365](/systems/microsoft-365.md)

## Inputs

- lookup_key
- date_range

## Outputs

- microsoft_365_records_records
- microsoft_365_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Microsoft 365](/systems/microsoft-365.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_platform_collection](/workflow/multi-platform-collection.md)

## Evals

- [Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workspace-analytics-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- microsoft_365_records_records
- microsoft_365_records_summary

# Examples

```
query_microsoft_365_microsoft_365_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Microsoft 365](/systems/microsoft-365.md)

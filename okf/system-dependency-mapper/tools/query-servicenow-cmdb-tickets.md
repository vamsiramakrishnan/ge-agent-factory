---
type: Agent Tool
title: query_servicenow_cmdb_tickets
description: Retrieve tickets from ServiceNow CMDB for the System Dependency Mapper workflow.
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

# query_servicenow_cmdb_tickets

Retrieve tickets from ServiceNow CMDB for the System Dependency Mapper workflow.

- **Kind:** query
- **Source system:** [ServiceNow CMDB](/systems/servicenow-cmdb.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow CMDB](/systems/servicenow-cmdb.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_discovery](/workflow/multi-source-discovery.md)
- [model_update](/workflow/model-update.md)

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_servicenow_cmdb_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ServiceNow CMDB](/systems/servicenow-cmdb.md)

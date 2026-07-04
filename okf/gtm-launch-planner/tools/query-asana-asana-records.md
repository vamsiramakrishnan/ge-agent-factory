---
type: Agent Tool
title: query_asana_asana_records
description: Retrieve asana records from Asana for the GTM Launch Planner workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_asana_asana_records

Retrieve asana records from Asana for the GTM Launch Planner workflow.

- **Kind:** query
- **Source system:** [Asana](/systems/asana.md)

## Inputs

- lookup_key
- date_range

## Outputs

- asana_records_records
- asana_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Asana](/systems/asana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [orchestration_setup](/workflow/orchestration-setup.md)

## Evals

- [Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gtm-launch-planner-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- asana_records_records
- asana_records_summary

# Examples

```
query_asana_asana_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Asana](/systems/asana.md)

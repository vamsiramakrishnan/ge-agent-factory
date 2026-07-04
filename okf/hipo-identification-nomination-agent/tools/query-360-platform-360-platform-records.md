---
type: Agent Tool
title: query_360_platform_360_platform_records
description: "Retrieve 360 platform records from 360 Platform for the HiPo Identification & Nomination Agent workflow."
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

# query_360_platform_360_platform_records

Retrieve 360 platform records from 360 Platform for the HiPo Identification & Nomination Agent workflow.

- **Kind:** query
- **Source system:** [360 Platform](/systems/360-platform.md)

## Inputs

- lookup_key
- date_range

## Outputs

- 360_platform_records_records
- 360_platform_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [360 Platform](/systems/360-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_collection](/workflow/signal-collection.md)

## Evals

- [Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hipo-identification-nomination-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- 360_platform_records_records
- 360_platform_records_summary

# Examples

```
query_360_platform_360_platform_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [360 Platform](/systems/360-platform.md)

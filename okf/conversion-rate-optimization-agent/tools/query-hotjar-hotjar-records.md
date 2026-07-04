---
type: Agent Tool
title: query_hotjar_hotjar_records
description: Retrieve hotjar records from Hotjar for the Conversion Rate Optimization Agent workflow.
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

# query_hotjar_hotjar_records

Retrieve hotjar records from Hotjar for the Conversion Rate Optimization Agent workflow.

- **Kind:** query
- **Source system:** [Hotjar](/systems/hotjar.md)

## Inputs

- lookup_key
- date_range

## Outputs

- hotjar_records_records
- hotjar_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Hotjar](/systems/hotjar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [behavioral_data_assembly](/workflow/behavioral-data-assembly.md)

## Evals

- [Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/conversion-rate-optimization-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- hotjar_records_records
- hotjar_records_summary

# Examples

```
query_hotjar_hotjar_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Hotjar](/systems/hotjar.md)

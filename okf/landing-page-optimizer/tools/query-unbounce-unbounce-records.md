---
type: Agent Tool
title: query_unbounce_unbounce_records
description: Retrieve unbounce records from Unbounce for the Landing Page Optimizer workflow.
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

# query_unbounce_unbounce_records

Retrieve unbounce records from Unbounce for the Landing Page Optimizer workflow.

- **Kind:** query
- **Source system:** [Unbounce](/systems/unbounce.md)

## Inputs

- lookup_key
- date_range

## Outputs

- unbounce_records_records
- unbounce_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Unbounce](/systems/unbounce.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [test_configuration](/workflow/test-configuration.md)

## Evals

- [Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/landing-page-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- unbounce_records_records
- unbounce_records_summary

# Examples

```
query_unbounce_unbounce_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Unbounce](/systems/unbounce.md)

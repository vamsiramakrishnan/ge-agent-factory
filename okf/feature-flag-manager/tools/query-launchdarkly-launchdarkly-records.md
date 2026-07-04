---
type: Agent Tool
title: query_launchdarkly_launchdarkly_records
description: Retrieve launchdarkly records from LaunchDarkly for the Feature Flag Manager workflow.
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

# query_launchdarkly_launchdarkly_records

Retrieve launchdarkly records from LaunchDarkly for the Feature Flag Manager workflow.

- **Kind:** query
- **Source system:** [LaunchDarkly](/systems/launchdarkly.md)

## Inputs

- lookup_key
- date_range

## Outputs

- launchdarkly_records_records
- launchdarkly_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LaunchDarkly](/systems/launchdarkly.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [flag_inventory](/workflow/flag-inventory.md)

## Evals

- [Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-flag-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- launchdarkly_records_records
- launchdarkly_records_summary

# Examples

```
query_launchdarkly_launchdarkly_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [LaunchDarkly](/systems/launchdarkly.md)

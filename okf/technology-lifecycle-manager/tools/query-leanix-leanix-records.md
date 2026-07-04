---
type: Agent Tool
title: query_leanix_leanix_records
description: Retrieve leanix records from LeanIX for the Technology Lifecycle Manager workflow.
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

# query_leanix_leanix_records

Retrieve leanix records from LeanIX for the Technology Lifecycle Manager workflow.

- **Kind:** query
- **Source system:** [LeanIX](/systems/leanix.md)

## Inputs

- lookup_key
- date_range

## Outputs

- leanix_records_records
- leanix_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LeanIX](/systems/leanix.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [technology_census](/workflow/technology-census.md)
- [portfolio_update](/workflow/portfolio-update.md)

## Evals

- [Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-lifecycle-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- leanix_records_records
- leanix_records_summary

# Examples

```
query_leanix_leanix_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [LeanIX](/systems/leanix.md)

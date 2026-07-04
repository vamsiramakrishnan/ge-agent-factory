---
type: Agent Tool
title: query_bynder_assets
description: Retrieve assets from Bynder for the Creative Asset Generator workflow.
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

# query_bynder_assets

Retrieve assets from Bynder for the Creative Asset Generator workflow.

- **Kind:** query
- **Source system:** [Bynder](/systems/bynder.md)

## Inputs

- lookup_key
- date_range

## Outputs

- assets_records
- assets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Bynder](/systems/bynder.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [approval_publishing](/workflow/approval-publishing.md)

## Evals

- [Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/creative-asset-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- assets_records
- assets_summary

# Examples

```
query_bynder_assets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Bynder](/systems/bynder.md)

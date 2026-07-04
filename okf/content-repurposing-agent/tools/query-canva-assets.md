---
type: Agent Tool
title: query_canva_assets
description: Retrieve assets from Canva for the Content Repurposing Agent workflow.
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

# query_canva_assets

Retrieve assets from Canva for the Content Repurposing Agent workflow.

- **Kind:** query
- **Source system:** [Canva](/systems/canva.md)

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

No explicit permission scopes declared; source-system access is tied to [Canva](/systems/canva.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [queue_distribution](/workflow/queue-distribution.md)

## Evals

- [Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-repurposing-agent-end-to-end.md)

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
query_canva_assets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Canva](/systems/canva.md)

---
type: Agent Tool
title: query_brandwatch_brand_mentions
description: Retrieve brand mentions from Brandwatch for the Crisis Communications Advisor workflow.
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

# query_brandwatch_brand_mentions

Retrieve brand mentions from Brandwatch for the Crisis Communications Advisor workflow.

- **Kind:** query
- **Source system:** [Brandwatch](/systems/brandwatch.md)

## Inputs

- lookup_key
- date_range

## Outputs

- brand_mentions_records
- brand_mentions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Brandwatch](/systems/brandwatch.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_detection](/workflow/signal-detection.md)

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- brand_mentions_records
- brand_mentions_summary

# Examples

```
query_brandwatch_brand_mentions(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Brandwatch](/systems/brandwatch.md)

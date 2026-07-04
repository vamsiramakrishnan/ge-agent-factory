---
type: Agent Tool
title: query_google_optimize_google_optimize_records
description: Retrieve google optimize records from Google Optimize for the Website Personalization Engine workflow.
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

# query_google_optimize_google_optimize_records

Retrieve google optimize records from Google Optimize for the Website Personalization Engine workflow.

- **Kind:** query
- **Source system:** [Google Optimize](/systems/google-optimize.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_optimize_records_records
- google_optimize_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Optimize](/systems/google-optimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [variant_serving_tracking](/workflow/variant-serving-tracking.md)

## Evals

- [Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/website-personalization-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_optimize_records_records
- google_optimize_records_summary

# Examples

```
query_google_optimize_google_optimize_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Optimize](/systems/google-optimize.md)

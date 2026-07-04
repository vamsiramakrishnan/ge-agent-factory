---
type: Agent Tool
title: query_google_slides_presentations
description: "Retrieve presentations from Google Slides for the L&D Plan Narrative Drafter workflow."
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

# query_google_slides_presentations

Retrieve presentations from Google Slides for the L&D Plan Narrative Drafter workflow.

- **Kind:** query
- **Source system:** [Google Slides](/systems/google-slides.md)

## Inputs

- lookup_key
- date_range

## Outputs

- presentations_records
- presentations_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Slides](/systems/google-slides.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [formatting_distribution](/workflow/formatting-distribution.md)

## Evals

- [Run the L&D Plan Narrative Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/l-d-plan-narrative-drafter-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- presentations_records
- presentations_summary

# Examples

```
query_google_slides_presentations(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Slides](/systems/google-slides.md)

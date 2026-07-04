---
type: Agent Tool
title: action_google_slides_generate
description: Execute the generate step in Google Slides after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_google_slides_generate

Execute the generate step in Google Slides after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Slides](/systems/google-slides.md)
- **API:** POST /api/google_slides/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Slides state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_slides_generate](/policies/confirmation-action-google-slides-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Slides](/systems/google-slides.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [board_narrative_generation](/workflow/board-narrative-generation.md)
- [deck_assembly_delivery](/workflow/deck-assembly-delivery.md)

## Evals

- [Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/board-deck-generator-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_google_slides_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Slides](/systems/google-slides.md)
- [Confirmation policy — action_google_slides_generate](/policies/confirmation-action-google-slides-generate.md)
- [Idempotency policy — action_google_slides_generate](/policies/idempotency-action-google-slides-generate.md)

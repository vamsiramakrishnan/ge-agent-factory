---
type: Agent Tool
title: action_lms_generate
description: Execute the generate step in LMS after the agent has gathered evidence and validated escalation gates.
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

# action_lms_generate

Execute the generate step in LMS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LMS](/systems/lms.md)
- **API:** POST /api/lms/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LMS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_lms_generate](/policies/confirmation-action-lms-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LMS](/systems/lms.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [summarization_quiz_generation](/workflow/summarization-quiz-generation.md)
- [multi_format_repurposing](/workflow/multi-format-repurposing.md)

## Evals

- [Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-content-summarizer-quiz-generator-end-to-end.md)

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
action_lms_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LMS](/systems/lms.md)
- [Confirmation policy — action_lms_generate](/policies/confirmation-action-lms-generate.md)
- [Idempotency policy — action_lms_generate](/policies/idempotency-action-lms-generate.md)

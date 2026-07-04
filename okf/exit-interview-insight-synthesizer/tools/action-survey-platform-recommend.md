---
type: Agent Tool
title: action_survey_platform_recommend
description: Execute the recommend step in Survey Platform after the agent has gathered evidence and validated escalation gates.
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

# action_survey_platform_recommend

Execute the recommend step in Survey Platform after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Survey Platform](/systems/survey-platform.md)
- **API:** POST /api/survey_platform/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Survey Platform state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_survey_platform_recommend](/policies/confirmation-action-survey-platform-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Survey Platform](/systems/survey-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [response_collection](/workflow/response-collection.md)
- [leadership_brief](/workflow/leadership-brief.md)

## Evals

- [Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/exit-interview-insight-synthesizer-end-to-end.md)

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
action_survey_platform_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Survey Platform](/systems/survey-platform.md)
- [Confirmation policy — action_survey_platform_recommend](/policies/confirmation-action-survey-platform-recommend.md)
- [Idempotency policy — action_survey_platform_recommend](/policies/idempotency-action-survey-platform-recommend.md)

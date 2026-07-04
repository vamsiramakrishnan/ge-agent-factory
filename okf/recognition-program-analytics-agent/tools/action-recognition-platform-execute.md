---
type: Agent Tool
title: action_recognition_platform_execute
description: Execute the execute step in Recognition Platform after the agent has gathered evidence and validated escalation gates.
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

# action_recognition_platform_execute

Execute the execute step in Recognition Platform after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Recognition Platform](/systems/recognition-platform.md)
- **API:** POST /api/recognition_platform/execute

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Recognition Platform state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_recognition_platform_execute](/policies/confirmation-action-recognition-platform-execute.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Recognition Platform](/systems/recognition-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [recognition_data_collection](/workflow/recognition-data-collection.md)
- [pattern_equity_analysis](/workflow/pattern-equity-analysis.md)
- [roi_correlation](/workflow/roi-correlation.md)

## Evals

- [Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-program-analytics-agent-end-to-end.md)

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
action_recognition_platform_execute(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Recognition Platform](/systems/recognition-platform.md)
- [Confirmation policy — action_recognition_platform_execute](/policies/confirmation-action-recognition-platform-execute.md)
- [Idempotency policy — action_recognition_platform_execute](/policies/idempotency-action-recognition-platform-execute.md)

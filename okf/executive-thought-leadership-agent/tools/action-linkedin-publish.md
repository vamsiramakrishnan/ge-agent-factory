---
type: Agent Tool
title: action_linkedin_publish
description: Execute the publish step in LinkedIn after the agent has gathered evidence and validated escalation gates.
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

# action_linkedin_publish

Execute the publish step in LinkedIn after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LinkedIn](/systems/linkedin.md)
- **API:** POST /api/linkedin/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LinkedIn state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_linkedin_publish](/policies/confirmation-action-linkedin-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LinkedIn](/systems/linkedin.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [topic_discovery](/workflow/topic-discovery.md)
- [publication_tracking](/workflow/publication-tracking.md)

## Evals

- [Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/executive-thought-leadership-agent-end-to-end.md)

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
action_linkedin_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LinkedIn](/systems/linkedin.md)
- [Confirmation policy — action_linkedin_publish](/policies/confirmation-action-linkedin-publish.md)
- [Idempotency policy — action_linkedin_publish](/policies/idempotency-action-linkedin-publish.md)

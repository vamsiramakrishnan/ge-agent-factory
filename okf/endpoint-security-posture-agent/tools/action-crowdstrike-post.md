---
type: Agent Tool
title: action_crowdstrike_post
description: Execute the post step in CrowdStrike after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_crowdstrike_post

Execute the post step in CrowdStrike after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [CrowdStrike](/systems/crowdstrike.md)
- **API:** POST /api/crowdstrike/post

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change CrowdStrike state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_crowdstrike_post](/policies/confirmation-action-crowdstrike-post.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [CrowdStrike](/systems/crowdstrike.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_posture_scan](/workflow/multi-source-posture-scan.md)

## Evals

- [Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/endpoint-security-posture-agent-end-to-end.md)

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
action_crowdstrike_post(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [CrowdStrike](/systems/crowdstrike.md)
- [Confirmation policy — action_crowdstrike_post](/policies/confirmation-action-crowdstrike-post.md)
- [Idempotency policy — action_crowdstrike_post](/policies/idempotency-action-crowdstrike-post.md)

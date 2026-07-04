---
type: Agent Tool
title: action_crowdstrike_generate
description: Execute the generate step in CrowdStrike after the agent has gathered evidence and validated escalation gates.
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

# action_crowdstrike_generate

Execute the generate step in CrowdStrike after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [CrowdStrike](/systems/crowdstrike.md)
- **API:** POST /api/crowdstrike/generate

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

- [Confirmation policy — action_crowdstrike_generate](/policies/confirmation-action-crowdstrike-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [CrowdStrike](/systems/crowdstrike.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [response_playbook_generation](/workflow/response-playbook-generation.md)

## Evals

- [Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/security-incident-responder-end-to-end.md)

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
action_crowdstrike_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [CrowdStrike](/systems/crowdstrike.md)
- [Confirmation policy — action_crowdstrike_generate](/policies/confirmation-action-crowdstrike-generate.md)
- [Idempotency policy — action_crowdstrike_generate](/policies/idempotency-action-crowdstrike-generate.md)

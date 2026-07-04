---
type: Agent Tool
title: action_highradius_recommend
description: Execute the recommend step in HighRadius after the agent has gathered evidence and validated escalation gates.
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

# action_highradius_recommend

Execute the recommend step in HighRadius after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [HighRadius](/systems/highradius.md)
- **API:** POST /api/highradius/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change HighRadius state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_highradius_recommend](/policies/confirmation-action-highradius-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [HighRadius](/systems/highradius.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [evidence_cross_reference](/workflow/evidence-cross-reference.md)
- [resolution_posting](/workflow/resolution-posting.md)

## Evals

- [Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispute-resolution-agent-end-to-end.md)

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
action_highradius_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [HighRadius](/systems/highradius.md)
- [Confirmation policy — action_highradius_recommend](/policies/confirmation-action-highradius-recommend.md)
- [Idempotency policy — action_highradius_recommend](/policies/idempotency-action-highradius-recommend.md)

---
type: Agent Tool
title: action_ariba_slp_recommend
description: Execute the recommend step in Ariba SLP after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ariba_slp_recommend

Execute the recommend step in Ariba SLP after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Ariba SLP](/systems/ariba-slp.md)
- **API:** POST /api/ariba_slp/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Ariba SLP state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ariba_slp_recommend](/policies/confirmation-action-ariba-slp-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ariba SLP](/systems/ariba-slp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [response_collection_normalization](/workflow/response-collection-normalization.md)
- [narrative_assessment_recommendation](/workflow/narrative-assessment-recommendation.md)

## Evals

- [Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capability-assessment-agent-end-to-end.md)

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
action_ariba_slp_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Ariba SLP](/systems/ariba-slp.md)
- [Confirmation policy — action_ariba_slp_recommend](/policies/confirmation-action-ariba-slp-recommend.md)
- [Idempotency policy — action_ariba_slp_recommend](/policies/idempotency-action-ariba-slp-recommend.md)

---
type: Agent Tool
title: action_okta_approve
description: Execute the approve step in Okta after the agent has gathered evidence and validated escalation gates.
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

# action_okta_approve

Execute the approve step in Okta after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Okta](/systems/okta.md)
- **API:** POST /api/okta/approve

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Okta state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_okta_approve](/policies/confirmation-action-okta-approve.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Okta](/systems/okta.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_signal_detection](/workflow/multi-signal-detection.md)
- [recommendation_reasoning](/workflow/recommendation-reasoning.md)
- [policy_enforcement](/workflow/policy-enforcement.md)

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

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
action_okta_approve(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Okta](/systems/okta.md)
- [Confirmation policy — action_okta_approve](/policies/confirmation-action-okta-approve.md)
- [Idempotency policy — action_okta_approve](/policies/idempotency-action-okta-approve.md)

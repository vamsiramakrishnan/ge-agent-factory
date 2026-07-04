---
type: Agent Tool
title: action_guidewire_policycenter_publish
description: Execute the publish step in Guidewire PolicyCenter after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_guidewire_policycenter_publish

Execute the publish step in Guidewire PolicyCenter after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- **API:** POST /api/guidewire_policycenter/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Guidewire PolicyCenter state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_guidewire_policycenter_publish](/policies/confirmation-action-guidewire-policycenter-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [non_renewal_candidate_identification](/workflow/non-renewal-candidate-identification.md)
- [publish_audit_trail](/workflow/publish-audit-trail.md)

## Evals

- [Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nonrenewal-notice-compliance-monitor-end-to-end.md)

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
action_guidewire_policycenter_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- [Confirmation policy — action_guidewire_policycenter_publish](/policies/confirmation-action-guidewire-policycenter-publish.md)
- [Idempotency policy — action_guidewire_policycenter_publish](/policies/idempotency-action-guidewire-policycenter-publish.md)

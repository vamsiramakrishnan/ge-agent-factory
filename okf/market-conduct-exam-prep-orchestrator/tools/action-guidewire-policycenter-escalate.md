---
type: Agent Tool
title: action_guidewire_policycenter_escalate
description: Execute the escalate step in Guidewire PolicyCenter after the agent has gathered evidence and validated escalation gates.
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

# action_guidewire_policycenter_escalate

Execute the escalate step in Guidewire PolicyCenter after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- **API:** POST /api/guidewire_policycenter/escalate

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

- [Confirmation policy — action_guidewire_policycenter_escalate](/policies/confirmation-action-guidewire-policycenter-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_call_scoping_record_pull](/workflow/data-call-scoping-record-pull.md)
- [examiner_package_assembly_escalation](/workflow/examiner-package-assembly-escalation.md)

## Evals

- [Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-conduct-exam-prep-orchestrator-end-to-end.md)

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
action_guidewire_policycenter_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- [Confirmation policy — action_guidewire_policycenter_escalate](/policies/confirmation-action-guidewire-policycenter-escalate.md)
- [Idempotency policy — action_guidewire_policycenter_escalate](/policies/idempotency-action-guidewire-policycenter-escalate.md)

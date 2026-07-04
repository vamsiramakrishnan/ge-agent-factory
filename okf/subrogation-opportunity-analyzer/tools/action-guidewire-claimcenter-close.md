---
type: Agent Tool
title: action_guidewire_claimcenter_close
description: Execute the close step in Guidewire ClaimCenter after the agent has gathered evidence and validated escalation gates.
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

# action_guidewire_claimcenter_close

Execute the close step in Guidewire ClaimCenter after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
- **API:** POST /api/guidewire_claimcenter/close

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Guidewire ClaimCenter state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_guidewire_claimcenter_close](/policies/confirmation-action-guidewire-claimcenter-close.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/subrogation-opportunity-analyzer-end-to-end.md)

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
action_guidewire_claimcenter_close(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
- [Confirmation policy — action_guidewire_claimcenter_close](/policies/confirmation-action-guidewire-claimcenter-close.md)
- [Idempotency policy — action_guidewire_claimcenter_close](/policies/idempotency-action-guidewire-claimcenter-close.md)

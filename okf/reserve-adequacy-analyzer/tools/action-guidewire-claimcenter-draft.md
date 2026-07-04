---
type: Agent Tool
title: action_guidewire_claimcenter_draft
description: Execute the draft step in Guidewire ClaimCenter after the agent has gathered evidence and validated escalation gates.
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

# action_guidewire_claimcenter_draft

Execute the draft step in Guidewire ClaimCenter after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
- **API:** POST /api/guidewire_claimcenter/draft

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

- [Confirmation policy — action_guidewire_claimcenter_draft](/policies/confirmation-action-guidewire-claimcenter-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [loss_triangle_assembly_reconciliation](/workflow/loss-triangle-assembly-reconciliation.md)
- [authority_evidence_validation](/workflow/authority-evidence-validation.md)
- [segment_exhibit_drafting_dashboard_publication](/workflow/segment-exhibit-drafting-dashboard-publication.md)
- [draft_action_escalation_routing](/workflow/draft-action-escalation-routing.md)

## Evals

- [Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reserve-adequacy-analyzer-end-to-end.md)

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
action_guidewire_claimcenter_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
- [Confirmation policy — action_guidewire_claimcenter_draft](/policies/confirmation-action-guidewire-claimcenter-draft.md)
- [Idempotency policy — action_guidewire_claimcenter_draft](/policies/idempotency-action-guidewire-claimcenter-draft.md)

---
type: Agent Tool
title: action_workiva_draft
description: Execute the draft step in Workiva after the agent has gathered evidence and validated escalation gates.
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

# action_workiva_draft

Execute the draft step in Workiva after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Workiva](/systems/workiva.md)
- **API:** POST /api/workiva/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Workiva state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_workiva_draft](/policies/confirmation-action-workiva-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workiva](/systems/workiva.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [disclosure_drafting](/workflow/disclosure-drafting.md)
- [report_assembly](/workflow/report-assembly.md)

## Evals

- [Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/esg-sustainability-reporter-end-to-end.md)

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
action_workiva_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Workiva](/systems/workiva.md)
- [Confirmation policy — action_workiva_draft](/policies/confirmation-action-workiva-draft.md)
- [Idempotency policy — action_workiva_draft](/policies/idempotency-action-workiva-draft.md)

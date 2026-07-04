---
type: Agent Tool
title: action_confluence_draft
description: Execute the draft step in Confluence after the agent has gathered evidence and validated escalation gates.
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

# action_confluence_draft

Execute the draft step in Confluence after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Confluence](/systems/confluence.md)
- **API:** POST /api/confluence/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Confluence state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_confluence_draft](/policies/confirmation-action-confluence-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Confluence](/systems/confluence.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_drafting](/workflow/policy-drafting.md)

## Evals

- [Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-lifecycle-manager-end-to-end.md)

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
action_confluence_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Confluence](/systems/confluence.md)
- [Confirmation policy — action_confluence_draft](/policies/confirmation-action-confluence-draft.md)
- [Idempotency policy — action_confluence_draft](/policies/idempotency-action-confluence-draft.md)

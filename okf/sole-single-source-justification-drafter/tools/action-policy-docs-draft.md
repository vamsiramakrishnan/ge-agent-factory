---
type: Agent Tool
title: action_policy_docs_draft
description: Execute the draft step in Policy docs after the agent has gathered evidence and validated escalation gates.
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

# action_policy_docs_draft

Execute the draft step in Policy docs after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Policy docs](/systems/policy-docs.md)
- **API:** POST /api/policy_docs/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Policy docs state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_policy_docs_draft](/policies/confirmation-action-policy-docs-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Policy docs](/systems/policy-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [request_intake_policy_check](/workflow/request-intake-policy-check.md)
- [justification_drafting_challenge](/workflow/justification-drafting-challenge.md)

## Evals

- [Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sole-single-source-justification-drafter-end-to-end.md)

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
action_policy_docs_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Policy docs](/systems/policy-docs.md)
- [Confirmation policy — action_policy_docs_draft](/policies/confirmation-action-policy-docs-draft.md)
- [Idempotency policy — action_policy_docs_draft](/policies/idempotency-action-policy-docs-draft.md)

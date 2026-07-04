---
type: Agent Tool
title: action_temenos_transact_escalate
description: Execute the escalate step in Temenos Transact after the agent has gathered evidence and validated escalation gates.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_temenos_transact_escalate

Execute the escalate step in Temenos Transact after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Temenos Transact](/systems/temenos-transact.md)
- **API:** POST /api/temenos_transact/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Temenos Transact state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_temenos_transact_escalate](/policies/confirmation-action-temenos-transact-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Temenos Transact](/systems/temenos-transact.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-opening-doc-followup-agent-end-to-end.md)

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
action_temenos_transact_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Temenos Transact](/systems/temenos-transact.md)
- [Confirmation policy — action_temenos_transact_escalate](/policies/confirmation-action-temenos-transact-escalate.md)
- [Idempotency policy — action_temenos_transact_escalate](/policies/idempotency-action-temenos-transact-escalate.md)

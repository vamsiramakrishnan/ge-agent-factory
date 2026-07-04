---
type: Agent Tool
title: action_kyriba_match
description: Execute the match step in Kyriba after the agent has gathered evidence and validated escalation gates.
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

# action_kyriba_match

Execute the match step in Kyriba after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Kyriba](/systems/kyriba.md)
- **API:** POST /api/kyriba/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Kyriba state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_kyriba_match](/policies/confirmation-action-kyriba-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kyriba](/systems/kyriba.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [automated_matching](/workflow/automated-matching.md)
- [exception_investigation](/workflow/exception-investigation.md)
- [clearing_reporting](/workflow/clearing-reporting.md)

## Evals

- [Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bank-reconciliation-agent-end-to-end.md)

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
action_kyriba_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Kyriba](/systems/kyriba.md)
- [Confirmation policy — action_kyriba_match](/policies/confirmation-action-kyriba-match.md)
- [Idempotency policy — action_kyriba_match](/policies/idempotency-action-kyriba-match.md)

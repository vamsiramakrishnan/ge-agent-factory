---
type: Agent Tool
title: action_coupa_generate
description: Execute the generate step in Coupa after the agent has gathered evidence and validated escalation gates.
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

# action_coupa_generate

Execute the generate step in Coupa after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Coupa](/systems/coupa.md)
- **API:** POST /api/coupa/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Coupa state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_coupa_generate](/policies/confirmation-action-coupa-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa](/systems/coupa.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [narrative_digest_generation](/workflow/narrative-digest-generation.md)

## Evals

- [Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-kpi-dashboard-end-to-end.md)

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
action_coupa_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Coupa](/systems/coupa.md)
- [Confirmation policy — action_coupa_generate](/policies/confirmation-action-coupa-generate.md)
- [Idempotency policy — action_coupa_generate](/policies/idempotency-action-coupa-generate.md)

---
type: Agent Tool
title: action_demandbase_generate
description: Execute the generate step in Demandbase after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_demandbase_generate

Execute the generate step in Demandbase after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Demandbase](/systems/demandbase.md)
- **API:** POST /api/demandbase/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Demandbase state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_demandbase_generate](/policies/confirmation-action-demandbase-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Demandbase](/systems/demandbase.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [account_intelligence](/workflow/account-intelligence.md)
- [strategy_generation](/workflow/strategy-generation.md)

## Evals

- [Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/abm-campaign-manager-end-to-end.md)

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
action_demandbase_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Demandbase](/systems/demandbase.md)
- [Confirmation policy — action_demandbase_generate](/policies/confirmation-action-demandbase-generate.md)
- [Idempotency policy — action_demandbase_generate](/policies/idempotency-action-demandbase-generate.md)

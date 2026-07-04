---
type: Agent Tool
title: action_hubspot_generate
description: Execute the generate step in HubSpot after the agent has gathered evidence and validated escalation gates.
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

# action_hubspot_generate

Execute the generate step in HubSpot after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [HubSpot](/systems/hubspot.md)
- **API:** POST /api/hubspot/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change HubSpot state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_hubspot_generate](/policies/confirmation-action-hubspot-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [HubSpot](/systems/hubspot.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [auto_generation_alerting](/workflow/auto-generation-alerting.md)

## Evals

- [Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/utm-tracking-governance-agent-end-to-end.md)

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
action_hubspot_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [HubSpot](/systems/hubspot.md)
- [Confirmation policy — action_hubspot_generate](/policies/confirmation-action-hubspot-generate.md)
- [Idempotency policy — action_hubspot_generate](/policies/idempotency-action-hubspot-generate.md)

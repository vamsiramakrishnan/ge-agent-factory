---
type: Agent Tool
title: action_launchdarkly_generate
description: Execute the generate step in LaunchDarkly after the agent has gathered evidence and validated escalation gates.
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

# action_launchdarkly_generate

Execute the generate step in LaunchDarkly after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LaunchDarkly](/systems/launchdarkly.md)
- **API:** POST /api/launchdarkly/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LaunchDarkly state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_launchdarkly_generate](/policies/confirmation-action-launchdarkly-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LaunchDarkly](/systems/launchdarkly.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [flag_inventory](/workflow/flag-inventory.md)
- [pr_generation](/workflow/pr-generation.md)

## Evals

- [Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-flag-manager-end-to-end.md)

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
action_launchdarkly_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LaunchDarkly](/systems/launchdarkly.md)
- [Confirmation policy — action_launchdarkly_generate](/policies/confirmation-action-launchdarkly-generate.md)
- [Idempotency policy — action_launchdarkly_generate](/policies/idempotency-action-launchdarkly-generate.md)

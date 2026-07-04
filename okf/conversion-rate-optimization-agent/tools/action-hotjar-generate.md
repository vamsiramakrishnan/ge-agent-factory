---
type: Agent Tool
title: action_hotjar_generate
description: Execute the generate step in Hotjar after the agent has gathered evidence and validated escalation gates.
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

# action_hotjar_generate

Execute the generate step in Hotjar after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Hotjar](/systems/hotjar.md)
- **API:** POST /api/hotjar/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Hotjar state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_hotjar_generate](/policies/confirmation-action-hotjar-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Hotjar](/systems/hotjar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [behavioral_data_assembly](/workflow/behavioral-data-assembly.md)
- [hypothesis_generation](/workflow/hypothesis-generation.md)
- [test_backlog_design](/workflow/test-backlog-design.md)

## Evals

- [Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/conversion-rate-optimization-agent-end-to-end.md)

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
action_hotjar_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Hotjar](/systems/hotjar.md)
- [Confirmation policy — action_hotjar_generate](/policies/confirmation-action-hotjar-generate.md)
- [Idempotency policy — action_hotjar_generate](/policies/idempotency-action-hotjar-generate.md)

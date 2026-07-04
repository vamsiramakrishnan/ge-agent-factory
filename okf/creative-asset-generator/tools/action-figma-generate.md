---
type: Agent Tool
title: action_figma_generate
description: Execute the generate step in Figma after the agent has gathered evidence and validated escalation gates.
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

# action_figma_generate

Execute the generate step in Figma after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Figma](/systems/figma.md)
- **API:** POST /api/figma/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Figma state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_figma_generate](/policies/confirmation-action-figma-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Figma](/systems/figma.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [copy_variation_generation](/workflow/copy-variation-generation.md)
- [approval_publishing](/workflow/approval-publishing.md)

## Evals

- [Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/creative-asset-generator-end-to-end.md)

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
action_figma_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Figma](/systems/figma.md)
- [Confirmation policy — action_figma_generate](/policies/confirmation-action-figma-generate.md)
- [Idempotency policy — action_figma_generate](/policies/idempotency-action-figma-generate.md)

---
type: Agent Tool
title: action_bynder_generate
description: Execute the generate step in Bynder after the agent has gathered evidence and validated escalation gates.
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

# action_bynder_generate

Execute the generate step in Bynder after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Bynder](/systems/bynder.md)
- **API:** POST /api/bynder/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Bynder state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_bynder_generate](/policies/confirmation-action-bynder-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Bynder](/systems/bynder.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [asset_ingestion](/workflow/asset-ingestion.md)
- [report_remediation](/workflow/report-remediation.md)

## Evals

- [Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-guidelines-enforcer-end-to-end.md)

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
action_bynder_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Bynder](/systems/bynder.md)
- [Confirmation policy — action_bynder_generate](/policies/confirmation-action-bynder-generate.md)
- [Idempotency policy — action_bynder_generate](/policies/idempotency-action-bynder-generate.md)

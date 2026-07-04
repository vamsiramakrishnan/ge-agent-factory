---
type: Agent Tool
title: action_insurance_3_generate
description: Execute the generate step in INSURANCE 3 after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_insurance_3_generate

Execute the generate step in INSURANCE 3 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [INSURANCE 3](/systems/insurance-3.md)
- **API:** POST /api/insurance_3/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change INSURANCE 3 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_insurance_3_generate](/policies/confirmation-action-insurance-3-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [INSURANCE 3](/systems/insurance-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [trend_loss_development_selection](/workflow/trend-loss-development-selection.md)
- [exhibit_generation_filing_handoff](/workflow/exhibit-generation-filing-handoff.md)

## Evals

- [Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rate-indication-preparation-engine-end-to-end.md)

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
action_insurance_3_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [INSURANCE 3](/systems/insurance-3.md)
- [Confirmation policy — action_insurance_3_generate](/policies/confirmation-action-insurance-3-generate.md)
- [Idempotency policy — action_insurance_3_generate](/policies/idempotency-action-insurance-3-generate.md)

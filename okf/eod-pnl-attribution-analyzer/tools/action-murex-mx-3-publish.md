---
type: Agent Tool
title: action_murex_mx_3_publish
description: Execute the publish step in Murex MX.3 after the agent has gathered evidence and validated escalation gates.
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

# action_murex_mx_3_publish

Execute the publish step in Murex MX.3 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)
- **API:** POST /api/murex_mx_3/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Murex MX.3 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_murex_mx_3_publish](/policies/confirmation-action-murex-mx-3-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [flash_to_final_p_l_capture](/workflow/flash-to-final-p-l-capture.md)
- [risk_based_attribution_decomposition](/workflow/risk-based-attribution-decomposition.md)
- [sign_off_publish_desk_escalation](/workflow/sign-off-publish-desk-escalation.md)

## Evals

- [Run the End-of-Day P&L Attribution Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eod-pnl-attribution-analyzer-end-to-end.md)

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
action_murex_mx_3_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
- [Confirmation policy — action_murex_mx_3_publish](/policies/confirmation-action-murex-mx-3-publish.md)
- [Idempotency policy — action_murex_mx_3_publish](/policies/idempotency-action-murex-mx-3-publish.md)

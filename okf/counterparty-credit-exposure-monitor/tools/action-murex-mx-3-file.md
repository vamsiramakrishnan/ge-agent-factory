---
type: Agent Tool
title: action_murex_mx_3_file
description: Execute the file step in Murex MX.3 after the agent has gathered evidence and validated escalation gates.
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

# action_murex_mx_3_file

Execute the file step in Murex MX.3 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)
- **API:** POST /api/murex_mx_3/file

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

- [Confirmation policy — action_murex_mx_3_file](/policies/confirmation-action-murex-mx-3-file.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [exposure_collateral_aggregation](/workflow/exposure-collateral-aggregation.md)
- [market_signal_wrong_way_risk_screening](/workflow/market-signal-wrong-way-risk-screening.md)
- [margin_call_dispute_reconciliation](/workflow/margin-call-dispute-reconciliation.md)
- [file_escalate](/workflow/file-escalate.md)

## Evals

- [Run the Counterparty Credit Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/counterparty-credit-exposure-monitor-end-to-end.md)

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
action_murex_mx_3_file(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
- [Confirmation policy — action_murex_mx_3_file](/policies/confirmation-action-murex-mx-3-file.md)
- [Idempotency policy — action_murex_mx_3_file](/policies/idempotency-action-murex-mx-3-file.md)

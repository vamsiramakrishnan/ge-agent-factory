---
type: Agent Tool
title: action_fenergo_clm_escalate
description: Execute the escalate step in Fenergo CLM after the agent has gathered evidence and validated escalation gates.
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

# action_fenergo_clm_escalate

Execute the escalate step in Fenergo CLM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)
- **API:** POST /api/fenergo_clm/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Fenergo CLM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_fenergo_clm_escalate](/policies/confirmation-action-fenergo-clm-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [list_hit_intake_interdiction_hold](/workflow/list-hit-intake-interdiction-hold.md)
- [identity_match_verification](/workflow/identity-match-verification.md)
- [escalation_payment_release_decision](/workflow/escalation-payment-release-decision.md)
- [audit_trail_kpi_reporting](/workflow/audit-trail-kpi-reporting.md)

## Evals

- [Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-screening-hit-analyzer-end-to-end.md)

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
action_fenergo_clm_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)
- [Confirmation policy — action_fenergo_clm_escalate](/policies/confirmation-action-fenergo-clm-escalate.md)
- [Idempotency policy — action_fenergo_clm_escalate](/policies/idempotency-action-fenergo-clm-escalate.md)

---
type: Agent Tool
title: action_ncino_loan_origination_escalate
description: Execute the escalate step in nCino Loan Origination after the agent has gathered evidence and validated escalation gates.
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

# action_ncino_loan_origination_escalate

Execute the escalate step in nCino Loan Origination after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [nCino Loan Origination](/systems/ncino-loan-origination.md)
- **API:** POST /api/ncino_loan_origination/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change nCino Loan Origination state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ncino_loan_origination_escalate](/policies/confirmation-action-ncino-loan-origination-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [nCino Loan Origination](/systems/ncino-loan-origination.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [covenant_calendar_extraction](/workflow/covenant-calendar-extraction.md)
- [financials_intake_ratio_computation](/workflow/financials-intake-ratio-computation.md)
- [policy_runbook_evidence_gating](/workflow/policy-runbook-evidence-gating.md)
- [escalation_waiver_memo_drafting](/workflow/escalation-waiver-memo-drafting.md)

## Evals

- [Run the Loan Covenant Monitoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loan-covenant-monitoring-agent-end-to-end.md)

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
action_ncino_loan_origination_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [nCino Loan Origination](/systems/ncino-loan-origination.md)
- [Confirmation policy — action_ncino_loan_origination_escalate](/policies/confirmation-action-ncino-loan-origination-escalate.md)
- [Idempotency policy — action_ncino_loan_origination_escalate](/policies/idempotency-action-ncino-loan-origination-escalate.md)

---
type: Agent Tool
title: action_ncino_loan_origination_generate
description: Execute the generate step in nCino Loan Origination after the agent has gathered evidence and validated escalation gates.
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

# action_ncino_loan_origination_generate

Execute the generate step in nCino Loan Origination after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [nCino Loan Origination](/systems/ncino-loan-origination.md)
- **API:** POST /api/ncino_loan_origination/generate

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

- [Confirmation policy — action_ncino_loan_origination_generate](/policies/confirmation-action-ncino-loan-origination-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [nCino Loan Origination](/systems/ncino-loan-origination.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [deal_intake_financial_spread_assembly](/workflow/deal-intake-financial-spread-assembly.md)
- [global_exposure_covenant_aggregation](/workflow/global-exposure-covenant-aggregation.md)
- [narrative_drafting_via_vertex_ai](/workflow/narrative-drafting-via-vertex-ai.md)
- [memo_generation_audit_trail](/workflow/memo-generation-audit-trail.md)

## Evals

- [Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)

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
action_ncino_loan_origination_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [nCino Loan Origination](/systems/ncino-loan-origination.md)
- [Confirmation policy — action_ncino_loan_origination_generate](/policies/confirmation-action-ncino-loan-origination-generate.md)
- [Idempotency policy — action_ncino_loan_origination_generate](/policies/idempotency-action-ncino-loan-origination-generate.md)

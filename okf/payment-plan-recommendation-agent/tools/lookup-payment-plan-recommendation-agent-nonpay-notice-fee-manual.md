---
type: Agent Tool
title: lookup_payment_plan_recommendation_agent_nonpay_notice_fee_manual
description: "Look up sections of the Nonpayment Cancellation Notice & Fee Waiver Rate Manual to cite in narrative output and escalation rationale."
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

# lookup_payment_plan_recommendation_agent_nonpay_notice_fee_manual

Look up sections of the Nonpayment Cancellation Notice & Fee Waiver Rate Manual to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire BillingCenter](/systems/guidewire-billingcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_payment_plan_recommendation_agent_nonpay_notice_fee_manual(section_anchor=<section_anchor>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

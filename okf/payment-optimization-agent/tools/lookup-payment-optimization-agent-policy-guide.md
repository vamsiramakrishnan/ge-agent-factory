---
type: Agent Tool
title: lookup_payment_optimization_agent_policy_guide
description: "Look up sections of the Payment Optimization Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_payment_optimization_agent_policy_guide

Look up sections of the Payment Optimization Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA FI (F110)](/systems/sap-s-4hana-fi-f110.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI (F110)](/systems/sap-s-4hana-fi-f110.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [payment_proposal_extraction](/workflow/payment-proposal-extraction.md)
- [discount_working_capital_optimization](/workflow/discount-working-capital-optimization.md)
- [treasury_briefing_generation](/workflow/treasury-briefing-generation.md)
- [payment_execution](/workflow/payment-execution.md)

## Evals

- [Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-optimization-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_payment_optimization_agent_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA FI (F110)](/systems/sap-s-4hana-fi-f110.md)

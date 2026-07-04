---
type: Agent Tool
title: lookup_p_card_reconciliation_agent_policy_guide
description: "Look up sections of the P-Card Reconciliation Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_p_card_reconciliation_agent_policy_guide

Look up sections of the P-Card Reconciliation Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)

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

No explicit permission scopes declared; source-system access is tied to [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_ingestion](/workflow/transaction-ingestion.md)
- [auto_categorization_anomaly_detection](/workflow/auto-categorization-anomaly-detection.md)
- [llm_interpretation_policy_validation](/workflow/llm-interpretation-policy-validation.md)
- [exception_reporting_reconciliation](/workflow/exception-reporting-reconciliation.md)

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_p_card_reconciliation_agent_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)

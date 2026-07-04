---
type: Agent Tool
title: query_policy_docs_policy_docs_records
description: "Retrieve policy docs records from Policy docs for the Travel & Expense Compliance Agent workflow."
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

# query_policy_docs_policy_docs_records

Retrieve policy docs records from Policy docs for the Travel & Expense Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Policy docs](/systems/policy-docs.md)

## Inputs

- lookup_key
- date_range

## Outputs

- policy_docs_records_records
- policy_docs_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Policy docs](/systems/policy-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_rule_validation](/workflow/policy-rule-validation.md)
- [context_interpretation_routing](/workflow/context-interpretation-routing.md)

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- policy_docs_records_records
- policy_docs_records_summary

# Examples

```
query_policy_docs_policy_docs_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Policy docs](/systems/policy-docs.md)

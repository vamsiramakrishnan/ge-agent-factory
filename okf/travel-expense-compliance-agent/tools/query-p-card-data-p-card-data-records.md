---
type: Agent Tool
title: query_p_card_data_p_card_data_records
description: "Retrieve p card data records from P-card data for the Travel & Expense Compliance Agent workflow."
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

# query_p_card_data_p_card_data_records

Retrieve p card data records from P-card data for the Travel & Expense Compliance Agent workflow.

- **Kind:** query
- **Source system:** [P-card data](/systems/p-card-data.md)

## Inputs

- lookup_key
- date_range

## Outputs

- p_card_data_records_records
- p_card_data_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [P-card data](/systems/p-card-data.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_rule_validation](/workflow/policy-rule-validation.md)

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- p_card_data_records_records
- p_card_data_records_summary

# Examples

```
query_p_card_data_p_card_data_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [P-card data](/systems/p-card-data.md)

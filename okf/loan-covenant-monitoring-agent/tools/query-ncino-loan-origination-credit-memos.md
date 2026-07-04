---
type: Agent Tool
title: query_ncino_loan_origination_credit_memos
description: Retrieve credit memos from nCino Loan Origination for the Loan Covenant Monitoring Agent workflow.
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

# query_ncino_loan_origination_credit_memos

Retrieve credit memos from nCino Loan Origination for the Loan Covenant Monitoring Agent workflow.

- **Kind:** query
- **Source system:** [nCino Loan Origination](/systems/ncino-loan-origination.md)

## Inputs

- memo_number
- application_number
- date_range

## Outputs

- credit_memos_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [nCino Loan Origination](/systems/ncino-loan-origination.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- memo_number
- application_number
- date_range

## Produces

- credit_memos_records

# Examples

```
query_ncino_loan_origination_credit_memos(memo_number=<memo_number>, application_number=<application_number>, date_range=<date_range>)
```

# Citations

- [nCino Loan Origination](/systems/ncino-loan-origination.md)

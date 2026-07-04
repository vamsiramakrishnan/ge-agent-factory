---
type: Agent Tool
title: query_ncino_loan_origination_loan_applications
description: Retrieve loan applications from nCino Loan Origination for the Commercial Credit Memo Drafting Agent workflow.
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

# query_ncino_loan_origination_loan_applications

Retrieve loan applications from nCino Loan Origination for the Commercial Credit Memo Drafting Agent workflow.

- **Kind:** query
- **Source system:** [nCino Loan Origination](/systems/ncino-loan-origination.md)

## Inputs

- application_number
- date_range

## Outputs

- loan_applications_records
- loan_applications_summary

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

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- application_number
- date_range

## Produces

- loan_applications_records
- loan_applications_summary

# Examples

```
query_ncino_loan_origination_loan_applications(application_number=<application_number>, date_range=<date_range>)
```

# Citations

- [nCino Loan Origination](/systems/ncino-loan-origination.md)

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

- [deal_intake_financial_spread_assembly](/workflow/deal-intake-financial-spread-assembly.md)
- [global_exposure_covenant_aggregation](/workflow/global-exposure-covenant-aggregation.md)
- [memo_generation_audit_trail](/workflow/memo-generation-audit-trail.md)

## Evals

- [Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)
- [Draft the first-cut credit memo for application 30184552 (Meridian Fabricators Inc., requested $3,250,000 term loan). loan_applications shows DSCR 1.32, but credit_memos memo #812044 for the same application_number lists global_cash_flow of $410,000 against roughly $525,000 of annual debt service -- that implies a DSCR closer to 0.78. Reconcile the discrepancy and tell me whether this memo is ready to route to committee.](/tests/commercial-credit-memo-drafting-agent-dscr-reconciliation.md)
- [Meridian Fabricators Inc. already carries $7.4M in committed exposure per its existing loan_applications and credit_memos records; new application 30184793 requests an additional $2.8M revolver, which would bring aggregate obligor exposure to $10.2M -- just above the $10,000,000 house limit. Also check covenant_records for covenant_id 612044 (compliance_status breached, next_test_date 2026-05-15) on the existing facility, which has not cured within 30 days. Determine whether the new application can be sent through action_ncino_loan_origination_generate.](/tests/commercial-credit-memo-drafting-agent-house-limit-covenant-edge.md)

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

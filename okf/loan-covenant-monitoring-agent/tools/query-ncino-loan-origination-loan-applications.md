---
type: Agent Tool
title: query_ncino_loan_origination_loan_applications
description: Retrieve loan applications from nCino Loan Origination for the Loan Covenant Monitoring Agent workflow.
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

Retrieve loan applications from nCino Loan Origination for the Loan Covenant Monitoring Agent workflow.

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

- [covenant_calendar_extraction](/workflow/covenant-calendar-extraction.md)
- [financials_intake_ratio_computation](/workflow/financials-intake-ratio-computation.md)
- [policy_runbook_evidence_gating](/workflow/policy-runbook-evidence-gating.md)
- [escalation_waiver_memo_drafting](/workflow/escalation-waiver-memo-drafting.md)

## Evals

- [Run the Loan Covenant Monitoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loan-covenant-monitoring-agent-end-to-end.md)
- [Covenant covenant_id 612044 tied to application_number 30441892 tested most_recent_test_value 1.28 against a threshold_value of 1.25 on a minimum_dscr covenant on 2026-06-30, so covenant_records shows compliance_status in_compliance. But credit_memo 812077 for the same application_number, dated 2026-06-15, lists global_cash_flow of -85,000, guarantor_strength unsupported, and policy_exception_count 4. Reconcile the covenant test result against the credit memo and tell me whether to close this facility's review.](/tests/loan-covenant-monitoring-agent-covenant-credit-memo-conflict.md)

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

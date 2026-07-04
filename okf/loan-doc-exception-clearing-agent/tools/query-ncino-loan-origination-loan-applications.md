---
type: Agent Tool
title: query_ncino_loan_origination_loan_applications
description: Retrieve loan applications from nCino Loan Origination for the Loan Documentation Exception Clearing Agent workflow.
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

Retrieve loan applications from nCino Loan Origination for the Loan Documentation Exception Clearing Agent workflow.

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

- [exception_intake_severity_triage](/workflow/exception-intake-severity-triage.md)
- [cure_evidence_correlation](/workflow/cure-evidence-correlation.md)
- [compliance_cure_runbook_gating](/workflow/compliance-cure-runbook-gating.md)
- [cure_dispatch_ticketing_escalation](/workflow/cure-dispatch-ticketing-escalation.md)

## Evals

- [Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loan-doc-exception-clearing-agent-end-to-end.md)
- [Credit memo 847213 on application_number 34210567 lists guarantor_strength unsupported and policy_exception_count 4. The insurance certificate cure item routes through DocuSign envelope covering that application, but the audit_trails entries for that envelope haven't updated in 31 days and the envelope's own status still reads negotiating. Operations wants the documentation exception on application 34210567 cleared today. Clear it or tell me why not.](/tests/loan-doc-exception-clearing-agent-stale-audit-trail-conflict.md)
- [Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom.](/tests/loan-doc-exception-clearing-agent-covenant-breach-ltv-stack.md)

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

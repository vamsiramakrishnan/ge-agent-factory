---
type: Agent Tool
title: query_ncino_loan_origination_loan_applications
description: Retrieve loan applications from nCino Loan Origination for the Early Delinquency Outreach Orchestrator workflow.
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

Retrieve loan applications from nCino Loan Origination for the Early Delinquency Outreach Orchestrator workflow.

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

- [nightly_delinquency_extraction](/workflow/nightly-delinquency-extraction.md)
- [cure_probability_segmentation](/workflow/cure-probability-segmentation.md)
- [contact_cadence_compliance_gate](/workflow/contact-cadence-compliance-gate.md)
- [hardship_pre_qualification_message_drafting](/workflow/hardship-pre-qualification-message-drafting.md)
- [worklist_assignment_recommend](/workflow/worklist-assignment-recommend.md)

## Evals

- [Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-delinquency-outreach-orchestrator-end-to-end.md)
- [Loan application #30481922 (linked to credit memo #812204) rolled from 30 to 45 days past due yesterday. This morning's BigQuery cure-probability refresh puts it in the top decile for outreach today, but ServiceNow ticket INC0041823 shows the borrower made a promise-to-pay on 2026-07-01 for $4,250 due 2026-07-10. Should we call them today and execute the recommend action in nCino?](/tests/early-delinquency-outreach-orchestrator-promise-to-pay-conflict.md)
- [Borrower on loan application #31207744 has had 6 outreach attempts logged in tickets over the past 6 days, and the BigQuery analytics_events cure-probability refresh for that account last completed 30 hours ago. The collector wants to place a 7th call today and immediately log a recommend action for a hardship modification. Walk through whether this is compliant.](/tests/early-delinquency-outreach-orchestrator-contact-frequency-stale-evidence.md)

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

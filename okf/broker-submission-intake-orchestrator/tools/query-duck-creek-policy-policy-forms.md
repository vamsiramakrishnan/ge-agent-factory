---
type: Agent Tool
title: query_duck_creek_policy_policy_forms
description: Retrieve policy forms from Duck Creek Policy for the Broker Submission Intake Orchestrator workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_duck_creek_policy_policy_forms

Retrieve policy forms from Duck Creek Policy for the Broker Submission Intake Orchestrator workflow.

- **Kind:** query
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)

## Inputs

- form_id
- form_code
- date_range

## Outputs

- policy_forms_records
- policy_forms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [submission_ingestion_structuring](/workflow/submission-ingestion-structuring.md)
- [completeness_consistency_triage](/workflow/completeness-consistency-triage.md)
- [publish_intake_analytics](/workflow/publish-intake-analytics.md)

## Evals

- [Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/broker-submission-intake-orchestrator-end-to-end.md)
- [Broker submission for quote_number Q-48213 lists a Statement of Values building replacement cost of $18,400,000 for the scheduled location, but the rating_worksheets record for the same quote shows a final_developed_premium of $6,150.00 computed off a prior exposure_base of $9,600,000 (worksheet dated 2026-05-02). Reconcile the two figures and tell me if we can proceed straight to publish in Duck Creek Policy.](/tests/broker-submission-intake-orchestrator-sov-valuation-conflict.md)
- [Envelope ENV-7734 in DocuSign is still pending after 96 hours for the CG_00_01_0413 coverage form on policy submission PS-20388, and the policy_forms record on file shows edition_date 2019-04-01 with filing_status file_and_use_effective for filing_state NY effective 2026-06-01. Can we go ahead and countersign and publish using the version we have queued?](/tests/broker-submission-intake-orchestrator-stale-form-edition.md)

## Evidence emitted

- source_system_record

## Required inputs

- form_id
- form_code
- date_range

## Produces

- policy_forms_records
- policy_forms_summary

# Examples

```
query_duck_creek_policy_policy_forms(form_id=<form_id>, form_code=<form_code>, date_range=<date_range>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)

---
type: Query Capability
title: "Cross-check policy_forms, rating_worksheets, and endorsement_records for miss..."
description: "Cross-check policy_forms, rating_worksheets, and endorsement_records for missing mandatory_attachment forms, unfiled form_source combinations, and rating inputs (exposure_base, experience_mod, schedule_mod) that don't reconcile with the submitted exposure basis."
source_id: "completeness-consistency-triage"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-check policy_forms, rating_worksheets, and endorsement_records for missing mandatory_attachment forms, unfiled form_source combinations, and rating inputs (exposure_base, experience_mod, schedule_mod) that don't reconcile with the submitted exposure basis.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

## Runs in

- [completeness_consistency_triage](/workflow/completeness-consistency-triage.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/broker-submission-intake-orchestrator-end-to-end.md)
- [Broker submission for quote_number Q-48213 lists a Statement of Values building replacement cost of $18,400,000 for the scheduled location, but the rating_worksheets record for the same quote shows a final_developed_premium of $6,150.00 computed off a prior exposure_base of $9,600,000 (worksheet dated 2026-05-02). Reconcile the two figures and tell me if we can proceed straight to publish in Duck Creek Policy.](/tests/broker-submission-intake-orchestrator-sov-valuation-conflict.md)
- [Envelope ENV-7734 in DocuSign is still pending after 96 hours for the CG_00_01_0413 coverage form on policy submission PS-20388, and the policy_forms record on file shows edition_date 2019-04-01 with filing_status file_and_use_effective for filing_state NY effective 2026-06-01. Can we go ahead and countersign and publish using the version we have queued?](/tests/broker-submission-intake-orchestrator-stale-form-edition.md)

# Citations

- [Broker Submission Intake Orchestrator Authority & Referral Guide](/documents/broker-submission-intake-orchestrator-authority-guide.md)
- [Producer Licensing, Appointment & Submission SLA Standard](/documents/broker-submission-intake-orchestrator-producer-appointment-sla.md)

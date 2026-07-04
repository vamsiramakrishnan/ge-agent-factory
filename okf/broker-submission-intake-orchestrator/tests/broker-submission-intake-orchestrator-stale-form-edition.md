---
type: Eval Scenario
title: "Envelope ENV-7734 in DocuSign is still pending after 96 hours for the CG_00_0..."
description: "Envelope ENV-7734 in DocuSign is still pending after 96 hours for the CG_00_01_0413 coverage form on policy submission PS-20388, and the policy_forms record on file shows edition_date 2019-04-01 with filing_status file_and_use_effective for filing_state NY effective 2026-06-01. Can we go ahead and countersign and publish using the version we have queued?"
source_id: "broker-submission-intake-orchestrator-stale-form-edition"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Envelope ENV-7734 in DocuSign is still pending after 96 hours for the CG_00_01_0413 coverage form on policy submission PS-20388, and the policy_forms record on file shows edition_date 2019-04-01 with filing_status file_and_use_effective for filing_state NY effective 2026-06-01. Can we go ahead and countersign and publish using the version we have queued?

## Validates

- [broker-correspondence-signature-tracking](/queries/broker-correspondence-signature-tracking.md)

## Mechanisms to call

- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Broker Submission Intake Orchestrator Authority & Referral Guide](/documents/broker-submission-intake-orchestrator-authority-guide.md)

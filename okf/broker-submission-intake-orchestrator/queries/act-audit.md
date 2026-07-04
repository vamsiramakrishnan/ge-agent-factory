---
type: Query Capability
title: "Execute the publish step in Duck Creek Policy with a full audit trail, and es..."
description: "Execute the publish step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Underwriting Assistant."
source_id: "act-audit"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Duck Creek Policy with a full audit trail, and escalate exceptions to the Underwriting Assistant.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/broker-submission-intake-orchestrator-end-to-end.md)

# Citations

- [Broker Submission Intake Orchestrator Authority & Referral Guide](/documents/broker-submission-intake-orchestrator-authority-guide.md)

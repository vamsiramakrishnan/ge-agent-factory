---
type: Eval Scenario
title: Run the Broker Submission Intake Orchestrator workflow for the current period...
description: "Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "broker-submission-intake-orchestrator-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

## Success rubric

Action publish executed against Duck Creek Policy, with audit-trail entry and Underwriting Assistant notified of outcomes.

# Citations

- [Broker Submission Intake Orchestrator Authority & Referral Guide](/documents/broker-submission-intake-orchestrator-authority-guide.md)

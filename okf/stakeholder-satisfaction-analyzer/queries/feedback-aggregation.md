---
type: Query Capability
title: "Pull survey responses from Qualtrics, aggregate ServiceNow ticket data (resol..."
description: "Pull survey responses from Qualtrics, aggregate ServiceNow ticket data (resolution times, reopens, escalations), and compile email communication signals into an analysis pipeline."
source_id: "feedback-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull survey responses from Qualtrics, aggregate ServiceNow ticket data (resolution times, reopens, escalations), and compile email communication signals into an analysis pipeline.

## Tools used

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_email_data_email_data_records](/tools/query-email-data-email-data-records.md)
- [lookup_stakeholder_satisfaction_analyzer_policy_guide](/tools/lookup-stakeholder-satisfaction-analyzer-policy-guide.md)
- [action_qualtrics_generate](/tools/action-qualtrics-generate.md)

## Runs in

- [feedback_aggregation](/workflow/feedback-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/stakeholder-satisfaction-analyzer-end-to-end.md)

# Citations

- [Stakeholder Satisfaction Analyzer Procurement Policy Guide](/documents/stakeholder-satisfaction-analyzer-policy-guide.md)

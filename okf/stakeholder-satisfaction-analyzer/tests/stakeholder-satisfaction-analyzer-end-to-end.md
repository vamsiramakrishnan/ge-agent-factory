---
type: Eval Scenario
title: Run the Stakeholder Satisfaction Analyzer workflow for the current period. Ci...
description: "Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "stakeholder-satisfaction-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [feedback-aggregation](/queries/feedback-aggregation.md)

## Mechanisms to call

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_email_data_email_data_records](/tools/query-email-data-email-data-records.md)
- [lookup_stakeholder_satisfaction_analyzer_policy_guide](/tools/lookup-stakeholder-satisfaction-analyzer-policy-guide.md)
- [action_qualtrics_generate](/tools/action-qualtrics-generate.md)

## Success rubric

Action generate executed against Qualtrics, with audit-trail entry and VP Procurement notified of outcomes.

# Citations

- [Stakeholder Satisfaction Analyzer Procurement Policy Guide](/documents/stakeholder-satisfaction-analyzer-policy-guide.md)

---
type: Workflow Stage
title: Feedback Aggregation
description: "Pull survey responses from Qualtrics, aggregate ServiceNow ticket data (resolution times, reopens, escalations), and compile email communication signals into an analysis pipeline."
source_id: feedback_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Feedback Aggregation

Pull survey responses from Qualtrics, aggregate ServiceNow ticket data (resolution times, reopens, escalations), and compile email communication signals into an analysis pipeline.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_email_data_email_data_records](/tools/query-email-data-email-data-records.md)
- [lookup_stakeholder_satisfaction_analyzer_policy_guide](/tools/lookup-stakeholder-satisfaction-analyzer-policy-guide.md)
- [action_qualtrics_generate](/tools/action-qualtrics-generate.md)

Next: [Root Cause Reasoning & Insights](/workflow/root-cause-reasoning-insights.md)

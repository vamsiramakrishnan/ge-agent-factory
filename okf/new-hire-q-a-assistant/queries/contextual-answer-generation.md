---
type: Query Capability
title: "Gemini generates accurate, cited answers tailored to the employee's role, loc..."
description: "Gemini generates accurate, cited answers tailored to the employee's role, location, and start date. Cross-references Workday profile for personalization."
source_id: "contextual-answer-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates accurate, cited answers tailored to the employee's role, location, and start date. Cross-references Workday profile for personalization.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_google_chat_post_answer](/tools/action-google-chat-post-answer.md)
- [action_servicenow_open_hr_ticket](/tools/action-servicenow-open-hr-ticket.md)

## Runs in

- [contextual_answer_generation](/workflow/contextual-answer-generation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-hire-q-a-assistant-end-to-end.md)

# Citations

- [New Hire Q&A Assistant Policy Handbook](/documents/new-hire-q-a-assistant-policy-handbook.md)

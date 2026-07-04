---
type: Workflow Stage
title: Contextual Answer Generation
description: "Gemini generates accurate, cited answers tailored to the employee's role, location, and start date. Cross-references Workday profile for personalization."
source_id: contextual_answer_generation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual Answer Generation

Gemini generates accurate, cited answers tailored to the employee's role, location, and start date. Cross-references Workday profile for personalization.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_google_chat_post_answer](/tools/action-google-chat-post-answer.md)
- [action_servicenow_open_hr_ticket](/tools/action-servicenow-open-hr-ticket.md)

Next: [Learning & Escalation](/workflow/learning-escalation.md)

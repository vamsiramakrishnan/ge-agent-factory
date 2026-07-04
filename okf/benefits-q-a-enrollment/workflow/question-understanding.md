---
type: Workflow Stage
title: Question Understanding
description: "Parse employee benefits question in natural language. Identify intent (plan info, enrollment change, life event, cost comparison) and retrieve employee context from Workday."
source_id: question_understanding
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Question Understanding

Parse employee benefits question in natural language. Identify intent (plan info, enrollment change, life event, cost comparison) and retrieve employee context from Workday.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_benefits_platform_enrollments](/tools/query-benefits-platform-enrollments.md)
- [action_benefits_platform_enroll](/tools/action-benefits-platform-enroll.md)
- [action_google_chat_notify_employee](/tools/action-google-chat-notify-employee.md)
- [evidence_open_enrollment_guide](/tools/evidence-open-enrollment-guide.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)

Next: [Plan Analysis](/workflow/plan-analysis.md)

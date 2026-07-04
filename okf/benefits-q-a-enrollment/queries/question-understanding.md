---
type: Query Capability
title: Parse employee benefits question in natural language. Identify intent (plan i...
description: "Parse employee benefits question in natural language. Identify intent (plan info, enrollment change, life event, cost comparison) and retrieve employee context from Workday."
source_id: "question-understanding"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse employee benefits question in natural language. Identify intent (plan info, enrollment change, life event, cost comparison) and retrieve employee context from Workday.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_benefits_platform_enrollments](/tools/query-benefits-platform-enrollments.md)
- [action_benefits_platform_enroll](/tools/action-benefits-platform-enroll.md)
- [action_google_chat_notify_employee](/tools/action-google-chat-notify-employee.md)
- [evidence_open_enrollment_guide](/tools/evidence-open-enrollment-guide.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)

## Runs in

- [question_understanding](/workflow/question-understanding.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail
- document_reference

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)
- [I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.](/tests/plan-comparison-no-action.md)
- [I had a baby 11 months ago — can you still add my child to family coverage today?](/tests/out-of-window-refusal.md)

# Citations

- [2026 Benefits Open Enrollment Guide](/documents/benefits-open-enrollment-guide.md)
- [Qualified Life Event Processing SOP](/documents/life-event-processing-sop.md)

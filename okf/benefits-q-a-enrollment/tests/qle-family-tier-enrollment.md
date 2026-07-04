---
type: Eval Scenario
title: "I am employee EMP-0007. I just had a baby and need to move to a family Standa..."
description: "I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm."
source_id: "qle-family-tier-enrollment"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.

## Validates

- [question-understanding](/queries/question-understanding.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_benefits_platform_enrollments](/tools/query-benefits-platform-enrollments.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)
- [action_benefits_platform_enroll](/tools/action-benefits-platform-enroll.md)
- [action_google_chat_notify_employee](/tools/action-google-chat-notify-employee.md)

## Success rubric

Enrollment submitted to Benefits Platform with carrier_sync_id and Google Chat confirmation sent to the employee.

# Citations

- [Qualified Life Event Processing SOP](/documents/life-event-processing-sop.md)
- [2026 Benefits Open Enrollment Guide](/documents/benefits-open-enrollment-guide.md)

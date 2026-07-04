---
type: Proof Obligation
title: "Golden eval obligation — I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm."
description: golden eval proof obligation
source_id: "eval-qle-family-tier-enrollment"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [qle-family-tier-enrollment](/tests/qle-family-tier-enrollment.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_benefits_platform_enrollments](/tools/query-benefits-platform-enrollments.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)
- [action_benefits_platform_enroll](/tools/action-benefits-platform-enroll.md)
- [action_google_chat_notify_employee](/tools/action-google-chat-notify-employee.md)

## Entities that must be referenced

- employees
- benefit_plans
- enrollments
- messages

## Forbidden behaviors

- do not invent enrollment_id or carrier_sync_id
- do not skip the QLE window check

# Citations

- [life-event-processing-sop](/documents/life-event-processing-sop.md)
- [benefits-open-enrollment-guide](/documents/benefits-open-enrollment-guide.md)

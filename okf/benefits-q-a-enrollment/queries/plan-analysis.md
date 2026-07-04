---
type: Query Capability
title: "Cross-reference employee eligibility against available plan options from Bene..."
description: "Cross-reference employee eligibility against available plan options from Benefitfocus. Retrieve relevant plan documents and SPD sections from Google Drive."
source_id: "plan-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cross-reference employee eligibility against available plan options from Benefitfocus. Retrieve relevant plan documents and SPD sections from Google Drive.

## Tools used

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [action_google_chat_notify_employee](/tools/action-google-chat-notify-employee.md)

## Runs in

- [plan_analysis](/workflow/plan-analysis.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)
- [I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.](/tests/plan-comparison-no-action.md)

# Citations

- [2026 Benefits Open Enrollment Guide](/documents/benefits-open-enrollment-guide.md)
- [Qualified Life Event Processing SOP](/documents/life-event-processing-sop.md)

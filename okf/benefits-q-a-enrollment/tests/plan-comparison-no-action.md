---
type: Eval Scenario
title: "I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me?..."
description: "I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet."
source_id: "plan-comparison-no-action"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.

## Validates

- [question-understanding](/queries/question-understanding.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [evidence_open_enrollment_guide](/tools/evidence-open-enrollment-guide.md)

## Success rubric

Side-by-side premium/deductible comparison with eligibility caveats; no enrollment action taken.

# Citations

- [2026 Benefits Open Enrollment Guide](/documents/benefits-open-enrollment-guide.md)

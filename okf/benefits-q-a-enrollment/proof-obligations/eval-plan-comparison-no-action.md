---
type: Proof Obligation
title: "Golden eval obligation — I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet."
description: golden eval proof obligation
source_id: "eval-plan-comparison-no-action"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [plan-comparison-no-action](/tests/plan-comparison-no-action.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [evidence_open_enrollment_guide](/tools/evidence-open-enrollment-guide.md)

## Entities that must be referenced

- employees
- benefit_plans

## Forbidden behaviors

- do not call action_benefits_platform_enroll without an explicit enroll request
- do not invent premium or deductible numbers

# Citations

- [benefits-open-enrollment-guide](/documents/benefits-open-enrollment-guide.md)

---
type: Agent Tool
title: query_benefits_platform_benefit_plans
description: "List the plans the employee is eligible for, scoped by region and coverage tier the employee can move into."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_benefits_platform_benefit_plans

List the plans the employee is eligible for, scoped by region and coverage tier the employee can move into.

- **Kind:** query
- **Source system:** [Benefits Platform](/systems/benefits-platform.md)

## Inputs

- region
- coverage_tier

## Outputs

- eligible_plan_set

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Benefits Platform](/systems/benefits-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [question_understanding](/workflow/question-understanding.md)
- [plan_analysis](/workflow/plan-analysis.md)

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)
- [I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.](/tests/plan-comparison-no-action.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- region
- coverage_tier

## Produces

- eligible_plan_set

# Examples

```
query_benefits_platform_benefit_plans(region=<region>, coverage_tier=<coverage_tier>)
```

# Citations

- [Benefits Platform](/systems/benefits-platform.md)

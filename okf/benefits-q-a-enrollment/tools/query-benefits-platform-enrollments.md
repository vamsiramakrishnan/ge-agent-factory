---
type: Agent Tool
title: query_benefits_platform_enrollments
description: "Return the employee's current active enrollment to compare against requested changes."
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

# query_benefits_platform_enrollments

Return the employee's current active enrollment to compare against requested changes.

- **Kind:** query
- **Source system:** [Benefits Platform](/systems/benefits-platform.md)

## Inputs

- employee_id

## Outputs

- current_enrollment

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

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- employee_id

## Produces

- current_enrollment

# Examples

```
query_benefits_platform_enrollments(employee_id=<employee_id>)
```

# Citations

- [Benefits Platform](/systems/benefits-platform.md)

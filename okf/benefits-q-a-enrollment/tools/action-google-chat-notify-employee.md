---
type: Agent Tool
title: action_google_chat_notify_employee
description: Send the employee a Google Chat confirmation that includes the enrollment_id and the audit_trail line from the Benefits Platform.
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

# action_google_chat_notify_employee

Send the employee a Google Chat confirmation that includes the enrollment_id and the audit_trail line from the Benefits Platform.

- **Kind:** notification
- **Source system:** [Google Chat](/systems/google-chat.md)

## Inputs

- employee_id
- enrollment_id
- audit_trail

## Outputs

- chat_message_id

## Side Effects

- May change Google Chat state because the spec classifies it as notification.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_google_chat_notify_employee](/policies/confirmation-action-google-chat-notify-employee.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Chat](/systems/google-chat.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [question_understanding](/workflow/question-understanding.md)
- [plan_analysis](/workflow/plan-analysis.md)

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- enrollment_id
- audit_trail

## Produces

- chat_message_id

# Examples

```
action_google_chat_notify_employee(employee_id=<employee_id>, enrollment_id=<enrollment_id>, audit_trail=<audit_trail>)
```

# Citations

- [Google Chat](/systems/google-chat.md)
- [Confirmation policy — action_google_chat_notify_employee](/policies/confirmation-action-google-chat-notify-employee.md)

---
type: Agent Tool
title: action_email_distribute_retrospective
description: Distribute the generated retrospective report and recommendations to controllers and accounting leadership via email.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_email_distribute_retrospective

Distribute the generated retrospective report and recommendations to controllers and accounting leadership via email.

- **Kind:** action
- **Source system:** [Looker](/systems/looker.md)
- **API:** POST /systems/email/retrospective-distribution

## Inputs

- recipient_list
- report_body
- cycle_id

## Outputs

- distribution_id
- delivery_timestamp

## Side Effects

- May change Looker state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_email_distribute_retrospective](/policies/confirmation-action-email-distribute-retrospective.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrospective_narrative](/workflow/retrospective-narrative.md)
- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)

## Evidence emitted

- api_response

## Required inputs

- recipient_list
- report_body
- cycle_id

## Produces

- distribution_id
- delivery_timestamp

# Examples

```
action_email_distribute_retrospective(recipient_list=<recipient_list>, report_body=<report_body>, cycle_id=<cycle_id>)
```

# Citations

- [Looker](/systems/looker.md)
- [Confirmation policy — action_email_distribute_retrospective](/policies/confirmation-action-email-distribute-retrospective.md)

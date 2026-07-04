---
type: Agent Tool
title: action_email_distribute_roi_report
description: "Send executive-ready ROI report with narrative and recommendations to VP Marketing and stakeholders, including investment reallocation logic."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_email_distribute_roi_report

Send executive-ready ROI report with narrative and recommendations to VP Marketing and stakeholders, including investment reallocation logic.

- **Kind:** action
- **Source system:** [Looker](/systems/looker.md)
- **API:** POST /systems/email/roi-report-distribution

## Inputs

- recipient_list
- roi_narrative
- recommendations

## Outputs

- email_id
- delivery_status

## Side Effects

- May change Looker state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_email_distribute_roi_report](/policies/confirmation-action-email-distribute-roi-report.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reporting_dashboards](/workflow/reporting-dashboards.md)

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- recipient_list
- roi_narrative
- recommendations

## Produces

- email_id
- delivery_status

# Examples

```
action_email_distribute_roi_report(recipient_list=<recipient_list>, roi_narrative=<roi_narrative>, recommendations=<recommendations>)
```

# Citations

- [Looker](/systems/looker.md)
- [Confirmation policy — action_email_distribute_roi_report](/policies/confirmation-action-email-distribute-roi-report.md)

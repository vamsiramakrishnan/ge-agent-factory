---
type: Agent Tool
title: action_email_publish_compliance_report
description: Distribute compliance exception report via email to category manager and procurement leadership.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_email_publish_compliance_report

Distribute compliance exception report via email to category manager and procurement leadership.

- **Kind:** action
- **Source system:** [Icertis](/systems/icertis.md)
- **API:** POST /systems/email/compliance-report-distribution

## Inputs

- report_content
- recipient_list

## Outputs

- delivery_id
- sent_timestamp

## Side Effects

- May change Icertis state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_email_publish_compliance_report](/policies/confirmation-action-email-publish-compliance-report.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Icertis](/systems/icertis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [terms_actuals_extraction](/workflow/terms-actuals-extraction.md)
- [pricing_volume_compliance_analysis](/workflow/pricing-volume-compliance-analysis.md)
- [formula_interpretation_advisory](/workflow/formula-interpretation-advisory.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response

## Required inputs

- report_content
- recipient_list

## Produces

- delivery_id
- sent_timestamp

# Examples

```
action_email_publish_compliance_report(report_content=<report_content>, recipient_list=<recipient_list>)
```

# Citations

- [Icertis](/systems/icertis.md)
- [Confirmation policy — action_email_publish_compliance_report](/policies/confirmation-action-email-publish-compliance-report.md)

---
type: Agent Tool
title: action_servicenow_create_compliance_ticket
description: Create ServiceNow compliance ticket for escalation to procurement and legal review.
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

# action_servicenow_create_compliance_ticket

Create ServiceNow compliance ticket for escalation to procurement and legal review.

- **Kind:** action
- **Source system:** [Icertis](/systems/icertis.md)
- **API:** POST /systems/servicenow/compliance-tickets

## Inputs

- exception_type
- financial_impact
- contract_id

## Outputs

- ticket_id
- ticket_status

## Side Effects

- May change Icertis state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_servicenow_create_compliance_ticket](/policies/confirmation-action-servicenow-create-compliance-ticket.md)

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

- exception_type
- financial_impact
- contract_id

## Produces

- ticket_id
- ticket_status

# Examples

```
action_servicenow_create_compliance_ticket(exception_type=<exception_type>, financial_impact=<financial_impact>, contract_id=<contract_id>)
```

# Citations

- [Icertis](/systems/icertis.md)
- [Confirmation policy — action_servicenow_create_compliance_ticket](/policies/confirmation-action-servicenow-create-compliance-ticket.md)

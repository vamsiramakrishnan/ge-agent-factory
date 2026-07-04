---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the NPS Detractor Recovery Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_zendesk_tickets

Retrieve tickets from Zendesk for the NPS Detractor Recovery Agent workflow.

- **Kind:** query
- **Source system:** [Zendesk](/systems/zendesk.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Zendesk](/systems/zendesk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [detractor_verbatim_triage](/workflow/detractor-verbatim-triage.md)
- [recovery_outreach_drafting_routing](/workflow/recovery-outreach-drafting-routing.md)
- [case_closure_churn_risk_escalation](/workflow/case-closure-churn-risk-escalation.md)

## Evals

- [Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nps-detractor-recovery-agent-end-to-end.md)
- [Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action.](/tests/nps-detractor-recovery-agent-repeat-contact-offer-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_zendesk_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Zendesk](/systems/zendesk.md)

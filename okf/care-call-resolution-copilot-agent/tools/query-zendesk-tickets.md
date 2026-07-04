---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the Care Call Resolution Copilot Agent workflow.
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

Retrieve tickets from Zendesk for the Care Call Resolution Copilot Agent workflow.

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

- [repeat_contact_known_issue_correlation](/workflow/repeat-contact-known-issue-correlation.md)

## Evals

- [Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/care-call-resolution-copilot-agent-end-to-end.md)
- [Account 48213076 (interaction_id 612938451) just called in on a network_complaint intent and passed CPNI authentication. Zendesk shows an open P2 ticket in the network category from 6 days ago with sla_met=false, plus a satisfaction_scores entry of 2.1 logged for this account 2 days ago. The floor agent wants to mark fcr_resolved=true and close this out as a fresh, unrelated contact. Reconcile whether this qualifies as first-call resolution or a repeat-contact escalation, and cite the runbook section that governs it.](/tests/care-call-resolution-copilot-agent-repeat-contact-reconciliation.md)

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

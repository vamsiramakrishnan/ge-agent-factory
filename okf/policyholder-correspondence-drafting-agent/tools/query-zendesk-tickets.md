---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the Policyholder Correspondence Drafting Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_zendesk_tickets

Retrieve tickets from Zendesk for the Policyholder Correspondence Drafting Agent workflow.

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

- [correspondence_trigger_intake](/workflow/correspondence-trigger-intake.md)

## Evals

- [Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policyholder-correspondence-drafting-agent-end-to-end.md)
- [Zendesk ticket #58321 is a policyholder complaint about the water-backup exclusion wording on form HO_00_03_0322. This is the second letter for this thread — satisfaction_scores record SAT-9042 logged a score of 2 after the first coverage-explanation letter went out on 2026-06-18, and a new satisfaction_scores record SAT-9107 logged this week also shows a score of 2. Draft the follow-up reply and send it out today.](/tests/policyholder-correspondence-drafting-agent-repeat-dissatisfaction.md)

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

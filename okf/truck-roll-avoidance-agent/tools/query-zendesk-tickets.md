---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the Truck Roll Avoidance Agent workflow.
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

Retrieve tickets from Zendesk for the Truck Roll Avoidance Agent workflow.

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

- [ticket_to_work_order_correlation](/workflow/ticket-to-work-order-correlation.md)

## Evals

- [Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/truck-roll-avoidance-agent-end-to-end.md)
- [Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 2026-07-02 reporting an intermittent drop, priority P2. The last BigQuery analytics_events line-diagnostic reading for this premise is dated 2026-06-29 (five days old) and shows a passing provisioning check, but the field_work_orders record shows repeat_within_30d=true with truck_rolls already at 2 for this premise. Decide whether to close this remotely or dispatch, and file the disposition.](/tests/truck-roll-avoidance-agent-stale-diagnostic-conflict.md)

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

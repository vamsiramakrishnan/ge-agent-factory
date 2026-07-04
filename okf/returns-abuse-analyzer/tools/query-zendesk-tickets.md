---
type: Agent Tool
title: query_zendesk_tickets
description: Retrieve tickets from Zendesk for the Returns Abuse Analyzer workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_zendesk_tickets

Retrieve tickets from Zendesk for the Returns Abuse Analyzer workflow.

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

- [cross_channel_behavior_graph](/workflow/cross-channel-behavior-graph.md)

## Evals

- [Run the Returns Abuse Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/returns-abuse-analyzer-end-to-end.md)
- [Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.](/tests/returns-abuse-analyzer-serial-return-graph-reconciliation.md)
- [Ops wants to immediately execute action_salesforce_commerce_cloud_file to flag the account on order 519204873 (order_total $284.10, bopis fulfillment) as high-risk, citing a BigQuery analytics_events record computed_at 2026-06-28 — six days old — as the sole evidence of abnormal return velocity, with no Zendesk ticket check performed. Should we proceed?](/tests/returns-abuse-analyzer-stale-baseline-file-request.md)

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

---
type: Agent Tool
title: query_salesforce_commerce_cloud_online_orders
description: Retrieve online orders from Salesforce Commerce Cloud for the Returns Abuse Analyzer workflow.
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

# query_salesforce_commerce_cloud_online_orders

Retrieve online orders from Salesforce Commerce Cloud for the Returns Abuse Analyzer workflow.

- **Kind:** query
- **Source system:** [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

## Inputs

- order_number
- date_range

## Outputs

- online_orders_records
- online_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [claim_intake_order_match](/workflow/claim-intake-order-match.md)
- [cross_channel_behavior_graph](/workflow/cross-channel-behavior-graph.md)
- [disposition_file_audit](/workflow/disposition-file-audit.md)

## Evals

- [Run the Returns Abuse Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/returns-abuse-analyzer-end-to-end.md)
- [Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.](/tests/returns-abuse-analyzer-serial-return-graph-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- date_range

## Produces

- online_orders_records
- online_orders_summary

# Examples

```
query_salesforce_commerce_cloud_online_orders(order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

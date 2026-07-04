---
type: Agent Tool
title: query_salesforce_commerce_cloud_online_orders
description: Retrieve online orders from Salesforce Commerce Cloud for the PDP Content Quality Agent workflow.
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

Retrieve online orders from Salesforce Commerce Cloud for the PDP Content Quality Agent workflow.

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

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)

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

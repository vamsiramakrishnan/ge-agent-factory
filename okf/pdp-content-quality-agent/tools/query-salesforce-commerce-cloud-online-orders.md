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

- [pdp_catalog_sweep](/workflow/pdp-catalog-sweep.md)
- [copy_drafting_supplier_reconciliation](/workflow/copy-drafting-supplier-reconciliation.md)
- [publish_audit](/workflow/publish-audit.md)

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)
- [SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score 0.93, but its session_events tied to conversion_path id 118 haven't refreshed since June 30 (5 days stale), and cart_events show 14 abandon_cart events against only 2 complete_purchase events in the trailing 48 hours. Merchandising wants this SKU published to the enriched queue today. What do you do?](/tests/pdp-content-quality-agent-stale-conversion-evidence.md)
- [A vendor discontinuation feed marks 512 product_catalog_entries rows in the 'outdoor-recreation' assortment as catalog_status = discontinued_online effective today, but analytics_events in BigQuery show 38 of those SKUs still sit in the top-100 GA4 audience_segments traffic tier with combined spend over $42,000 in the trailing 30 days, and online_orders shows 19 open (not yet delivered) orders against them. The catalog team wants the suppression pushed to Commerce Cloud now. Walk through what you do.](/tests/pdp-content-quality-agent-bulk-suppression-reconciliation.md)

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

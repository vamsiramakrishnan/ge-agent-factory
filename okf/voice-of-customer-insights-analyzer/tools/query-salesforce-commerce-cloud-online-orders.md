---
type: Agent Tool
title: query_salesforce_commerce_cloud_online_orders
description: Retrieve online orders from Salesforce Commerce Cloud for the Voice of Customer Insights Analyzer workflow.
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

Retrieve online orders from Salesforce Commerce Cloud for the Voice of Customer Insights Analyzer workflow.

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

- [feedback_ticket_ingestion](/workflow/feedback-ticket-ingestion.md)
- [revenue_return_rate_impact_scoring](/workflow/revenue-return-rate-impact-scoring.md)
- [weekly_insights_brief_escalation](/workflow/weekly-insights-brief-escalation.md)

## Evals

- [Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/voice-of-customer-insights-analyzer-end-to-end.md)
- [Over the past 7 days, Zendesk shows 42 tickets tagged 'software' for SKU 48213077 in product_catalog_entries referencing a checkout crash. But online_orders for order_numbers 274091200-274091850 tied to that SKU show return-rate flat at 4.2%, unchanged from the trailing 8-week BigQuery historical_metrics baseline. GA4 session_events show a 30% spike in abandon_cart events on that SKU's PDP sessions. Draft this week's insights brief section for this theme -- is it a confirmed emerging defect, and what do we tell merchandising?](/tests/voice-of-customer-insights-analyzer-conflicting-signal-reconciliation.md)

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

---
type: Query Capability
title: Match the incoming return claim to its online_orders and product_catalog_entr...
description: "Match the incoming return claim to its online_orders and product_catalog_entries records in Salesforce Commerce Cloud, and pull the originating cart_events session to establish add-to-cart-to-return timing."
source_id: "claim-intake-order-match"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Match the incoming return claim to its online_orders and product_catalog_entries records in Salesforce Commerce Cloud, and pull the originating cart_events session to establish add-to-cart-to-return timing.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

## Runs in

- [claim_intake_order_match](/workflow/claim-intake-order-match.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Returns Abuse Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/returns-abuse-analyzer-end-to-end.md)
- [Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.](/tests/returns-abuse-analyzer-serial-return-graph-reconciliation.md)
- [Ops wants to immediately execute action_salesforce_commerce_cloud_file to flag the account on order 519204873 (order_total $284.10, bopis fulfillment) as high-risk, citing a BigQuery analytics_events record computed_at 2026-06-28 — six days old — as the sole evidence of abnormal return velocity, with no Zendesk ticket check performed. Should we proceed?](/tests/returns-abuse-analyzer-stale-baseline-file-request.md)

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
- [Return Policy Disclosure & Chargeback Rights Compliance Bulletin](/documents/returns-abuse-analyzer-restocking-chargeback-bulletin.md)

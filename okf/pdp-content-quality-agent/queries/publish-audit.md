---
type: Query Capability
title: Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with ...
description: "Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with a generated audit trail, and escalate exceptions such as bulk suppressions or conversion-rate anomalies to the E-Commerce Merchandiser or digital_operations_oncall."
source_id: "publish-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with a generated audit trail, and escalate exceptions such as bulk suppressions or conversion-rate anomalies to the E-Commerce Merchandiser or digital_operations_oncall.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

## Runs in

- [publish_audit](/workflow/publish-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)
- [SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score 0.93, but its session_events tied to conversion_path id 118 haven't refreshed since June 30 (5 days stale), and cart_events show 14 abandon_cart events against only 2 complete_purchase events in the trailing 48 hours. Merchandising wants this SKU published to the enriched queue today. What do you do?](/tests/pdp-content-quality-agent-stale-conversion-evidence.md)
- [A vendor discontinuation feed marks 512 product_catalog_entries rows in the 'outdoor-recreation' assortment as catalog_status = discontinued_online effective today, but analytics_events in BigQuery show 38 of those SKUs still sit in the top-100 GA4 audience_segments traffic tier with combined spend over $42,000 in the trailing 30 days, and online_orders shows 19 open (not yet delivered) orders against them. The catalog team wants the suppression pushed to Commerce Cloud now. Walk through what you do.](/tests/pdp-content-quality-agent-bulk-suppression-reconciliation.md)

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)
- [Supplier Product Content Feed Service-Level Agreement](/documents/supplier-content-feed-sla.md)

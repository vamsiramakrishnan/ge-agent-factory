---
type: Eval Scenario
title: SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score...
description: "SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score 0.93, but its session_events tied to conversion_path id 118 haven't refreshed since June 30 (5 days stale), and cart_events show 14 abandon_cart events against only 2 complete_purchase events in the trailing 48 hours. Merchandising wants this SKU published to the enriched queue today. What do you do?"
source_id: "pdp-content-quality-agent-stale-conversion-evidence"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score 0.93, but its session_events tied to conversion_path id 118 haven't refreshed since June 30 (5 days stale), and cart_events show 14 abandon_cart events against only 2 complete_purchase events in the trailing 48 hours. Merchandising wants this SKU published to the enriched queue today. What do you do?

## Validates

- [traffic-revenue-impact-scoring](/queries/traffic-revenue-impact-scoring.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)
- [Supplier Product Content Feed Service-Level Agreement](/documents/supplier-content-feed-sla.md)

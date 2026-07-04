---
type: Eval Scenario
title: "A vendor discontinuation feed marks 512 product_catalog_entries rows in the '..."
description: "A vendor discontinuation feed marks 512 product_catalog_entries rows in the 'outdoor-recreation' assortment as catalog_status = discontinued_online effective today, but analytics_events in BigQuery show 38 of those SKUs still sit in the top-100 GA4 audience_segments traffic tier with combined spend over $42,000 in the trailing 30 days, and online_orders shows 19 open (not yet delivered) orders against them. The catalog team wants the suppression pushed to Commerce Cloud now. Walk through what you do."
source_id: "pdp-content-quality-agent-bulk-suppression-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# A vendor discontinuation feed marks 512 product_catalog_entries rows in the 'outdoor-recreation' assortment as catalog_status = discontinued_online effective today, but analytics_events in BigQuery show 38 of those SKUs still sit in the top-100 GA4 audience_segments traffic tier with combined spend over $42,000 in the trailing 30 days, and online_orders shows 19 open (not yet delivered) orders against them. The catalog team wants the suppression pushed to Commerce Cloud now. Walk through what you do.

## Validates

- [traffic-revenue-impact-scoring](/queries/traffic-revenue-impact-scoring.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)

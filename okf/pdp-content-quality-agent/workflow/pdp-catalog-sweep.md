---
type: Workflow Stage
title: PDP Catalog Sweep
description: "Query product_catalog_entries and online_orders from Salesforce Commerce Cloud to flag missing attributes, thin descriptions, image_count gaps, and stale content_completeness_score across the live assortment."
source_id: pdp_catalog_sweep
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# PDP Catalog Sweep

Query product_catalog_entries and online_orders from Salesforce Commerce Cloud to flag missing attributes, thin descriptions, image_count gaps, and stale content_completeness_score across the live assortment.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

Next: [Traffic & Revenue Impact Scoring](/workflow/traffic-revenue-impact-scoring.md)

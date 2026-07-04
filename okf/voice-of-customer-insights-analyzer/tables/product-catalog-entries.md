---
type: Data Entity
title: product_catalog_entries
description: Data entity product_catalog_entries owned by Salesforce Commerce Cloud.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# product_catalog_entries

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| product_title | lorem.sentence | required |
| brand | company.name | required |
| catalog_status | enum | required; values: live, suppressed, pending_enrichment, discontinued_online |
| content_completeness_score | float | required |
| image_count | number | required |
| search_rank | number |  |
| pdp_conversion_rate | float | required |
| rich_content_flag | boolean | required |
| online_order_id | ref | required |

# Citations

- Owned by [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

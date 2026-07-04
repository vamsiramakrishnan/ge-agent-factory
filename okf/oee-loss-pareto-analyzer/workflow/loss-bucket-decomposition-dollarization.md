---
type: Workflow Stage
title: "Loss Bucket Decomposition & Dollarization"
description: "Classify losses into availability, performance, and quality buckets using quality_checks (cpk, scrap_qty, result) and production_orders (planned_qty, confirmed_qty, oee_impact), then dollarize each bucket."
source_id: loss_bucket_decomposition_dollarization
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loss Bucket Decomposition & Dollarization

Classify losses into availability, performance, and quality buckets using quality_checks (cpk, scrap_qty, result) and production_orders (planned_qty, confirmed_qty, oee_impact), then dollarize each bucket.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

Next: [SOP & Classification Standard Evidence Gate](/workflow/sop-classification-standard-evidence-gate.md)

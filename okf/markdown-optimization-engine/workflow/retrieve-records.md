---
type: Workflow Stage
title: Retrieve Records
description: Query price recommendations and price zones from Revionics Price Optimization and correlate with Oracle Retail MFCS for the Markdown Optimization Engine workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query price recommendations and price zones from Revionics Price Optimization and correlate with Oracle Retail MFCS for the Markdown Optimization Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

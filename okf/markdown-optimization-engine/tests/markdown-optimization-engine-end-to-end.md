---
type: Eval Scenario
title: Run the Markdown Optimization Engine workflow for the current period. Cite th...
description: "Run the Markdown Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "markdown-optimization-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Markdown Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

## Success rubric

Action escalate executed against Oracle Retail MFCS, with audit-trail entry and Pricing Analyst notified of outcomes.

# Citations

- [Markdown Optimization Engine Retail Execution Playbook](/documents/markdown-optimization-engine-execution-playbook.md)

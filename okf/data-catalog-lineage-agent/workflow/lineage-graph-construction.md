---
type: Workflow Stage
title: Lineage Graph Construction
description: "Build column-level lineage graph from dbt model definitions and BigQuery query logs. Track data flow from source system through transformations to consumption layer."
source_id: lineage_graph_construction
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Lineage Graph Construction

Build column-level lineage graph from dbt model definitions and BigQuery query logs. Track data flow from source system through transformations to consumption layer.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)

Next: [Natural Language Data Discovery](/workflow/natural-language-data-discovery.md)

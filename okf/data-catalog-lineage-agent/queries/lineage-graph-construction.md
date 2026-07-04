---
type: Query Capability
title: "Build column-level lineage graph from dbt model definitions and BigQuery quer..."
description: "Build column-level lineage graph from dbt model definitions and BigQuery query logs. Track data flow from source system through transformations to consumption layer."
source_id: "lineage-graph-construction"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Build column-level lineage graph from dbt model definitions and BigQuery query logs. Track data flow from source system through transformations to consumption layer.

## Tools used

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)

## Runs in

- [lineage_graph_construction](/workflow/lineage-graph-construction.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

# Citations

- [Data Catalog & Lineage Agent Operations Runbook](/documents/data-catalog-lineage-agent-runbook.md)

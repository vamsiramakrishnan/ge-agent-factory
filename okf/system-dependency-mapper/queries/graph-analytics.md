---
type: Query Capability
title: "Run critical path analysis, single-point-of-failure detection, circular depen..."
description: "Run critical path analysis, single-point-of-failure detection, circular dependency identification, and change blast radius calculation on the unified graph."
source_id: "graph-analytics"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run critical path analysis, single-point-of-failure detection, circular dependency identification, and change blast radius calculation on the unified graph.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_system_dependency_mapper_runbook](/tools/lookup-system-dependency-mapper-runbook.md)

## Runs in

- [graph_analytics](/workflow/graph-analytics.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

# Citations

- [System Dependency Mapper Operations Runbook](/documents/system-dependency-mapper-runbook.md)

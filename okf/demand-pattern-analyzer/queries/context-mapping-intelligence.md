---
type: Query Capability
title: "Gemini cross-references demand anomalies with business context — ERP migratio..."
description: "Gemini cross-references demand anomalies with business context — ERP migration bulk purchases, new product line launches, plant turnarounds. Reads production planning communications to anticipate demand shifts before they appear in requisition data. Generates pattern reports distinguishing one-time events from trend shifts."
source_id: "context-mapping-intelligence"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini cross-references demand anomalies with business context — ERP migration bulk purchases, new product line launches, plant turnarounds. Reads production planning communications to anticipate demand shifts before they appear in requisition data. Generates pattern reports distinguishing one-time events from trend shifts.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_pattern_analyzer_policy_guide](/tools/lookup-demand-pattern-analyzer-policy-guide.md)

## Runs in

- [context_mapping_intelligence](/workflow/context-mapping-intelligence.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-pattern-analyzer-end-to-end.md)

# Citations

- [Demand Pattern Analyzer Procurement Policy Guide](/documents/demand-pattern-analyzer-policy-guide.md)

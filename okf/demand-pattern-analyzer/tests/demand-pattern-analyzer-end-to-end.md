---
type: Eval Scenario
title: Run the Demand Pattern Analyzer workflow for the current period. Cite the rel...
description: "Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "demand-pattern-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [context-mapping-intelligence](/queries/context-mapping-intelligence.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_demand_pattern_analyzer_policy_guide](/tools/lookup-demand-pattern-analyzer-policy-guide.md)

## Success rubric

Category Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Demand Pattern Analyzer Procurement Policy Guide](/documents/demand-pattern-analyzer-policy-guide.md)

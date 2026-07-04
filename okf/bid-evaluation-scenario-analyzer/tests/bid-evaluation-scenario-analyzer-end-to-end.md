---
type: Eval Scenario
title: "Run the Bid Evaluation & Scenario Analyzer workflow for the current period. C..."
description: "Run the Bid Evaluation & Scenario Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "bid-evaluation-scenario-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Bid Evaluation & Scenario Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [bid-collection-normalization](/queries/bid-collection-normalization.md)

## Mechanisms to call

- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bid_evaluation_scenario_analyzer_policy_guide](/tools/lookup-bid-evaluation-scenario-analyzer-policy-guide.md)

## Success rubric

Sourcing Committee receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Bid Evaluation & Scenario Analyzer Procurement Policy Guide](/documents/bid-evaluation-scenario-analyzer-policy-guide.md)

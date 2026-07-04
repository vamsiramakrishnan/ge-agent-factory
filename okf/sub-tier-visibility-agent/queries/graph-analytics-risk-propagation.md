---
type: Query Capability
title: "Build multi-tier supply network graph in BigQuery. Run risk propagation model..."
description: "Build multi-tier supply network graph in BigQuery. Run risk propagation modeling — if a tier-2 supplier fails, which tier-1 suppliers and which products are affected? Concentration analysis at each tier level."
source_id: "graph-analytics-risk-propagation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Build multi-tier supply network graph in BigQuery. Run risk propagation modeling — if a tier-2 supplier fails, which tier-1 suppliers and which products are affected? Concentration analysis at each tier level.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sub_tier_visibility_agent_policy_guide](/tools/lookup-sub-tier-visibility-agent-policy-guide.md)

## Runs in

- [graph_analytics_risk_propagation](/workflow/graph-analytics-risk-propagation.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sub-tier-visibility-agent-end-to-end.md)

# Citations

- [Sub-Tier Visibility Agent Procurement Policy Guide](/documents/sub-tier-visibility-agent-policy-guide.md)

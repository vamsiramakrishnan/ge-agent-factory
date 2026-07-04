---
type: Workflow Stage
title: "Ring Clustering & Severity Scoring"
description: "Score cluster velocity and claims_sharing_this_entity counts against BigQuery historical_metrics and cached_aggregates to distinguish an isolated coincidence from a choreographed, organized loss sequence."
source_id: ring_clustering_severity_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ring Clustering & Severity Scoring

Score cluster velocity and claims_sharing_this_entity counts against BigQuery historical_metrics and cached_aggregates to distinguish an isolated coincidence from a choreographed, organized loss sequence.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)

Next: [Authority-Gated Case Consolidation](/workflow/authority-gated-case-consolidation.md)

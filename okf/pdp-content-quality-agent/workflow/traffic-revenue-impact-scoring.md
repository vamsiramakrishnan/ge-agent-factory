---
type: Workflow Stage
title: "Traffic & Revenue Impact Scoring"
description: "Cross-reference session_events, conversion_paths, and audience_segments from GA4 with historical_metrics and cached_aggregates in BigQuery to rank enrichment candidates by traffic and revenue impact."
source_id: traffic_revenue_impact_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Traffic & Revenue Impact Scoring

Cross-reference session_events, conversion_paths, and audience_segments from GA4 with historical_metrics and cached_aggregates in BigQuery to rank enrichment candidates by traffic and revenue impact.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)

Next: [Copy Drafting & Supplier Reconciliation](/workflow/copy-drafting-supplier-reconciliation.md)

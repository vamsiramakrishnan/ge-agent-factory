---
type: Workflow Stage
title: Channel Data Collection
description: "Aggregate source attribution, funnel metrics, and cost data from Greenhouse, LinkedIn, and Indeed into BigQuery analytics warehouse."
source_id: channel_data_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Channel Data Collection

Aggregate source attribution, funnel metrics, and cost data from Greenhouse, LinkedIn, and Indeed into BigQuery analytics warehouse.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_sourcing_channel_analytics_agent_policy_handbook](/tools/lookup-sourcing-channel-analytics-agent-policy-handbook.md)

Next: [ROI & Quality Analysis](/workflow/roi-quality-analysis.md)

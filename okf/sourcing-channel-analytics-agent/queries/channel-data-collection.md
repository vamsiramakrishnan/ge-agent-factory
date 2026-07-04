---
type: Query Capability
title: "Aggregate source attribution, funnel metrics, and cost data from Greenhouse, ..."
description: "Aggregate source attribution, funnel metrics, and cost data from Greenhouse, LinkedIn, and Indeed into BigQuery analytics warehouse."
source_id: "channel-data-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate source attribution, funnel metrics, and cost data from Greenhouse, LinkedIn, and Indeed into BigQuery analytics warehouse.

## Tools used

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_sourcing_channel_analytics_agent_policy_handbook](/tools/lookup-sourcing-channel-analytics-agent-policy-handbook.md)

## Runs in

- [channel_data_collection](/workflow/channel-data-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sourcing-channel-analytics-agent-end-to-end.md)

# Citations

- [Sourcing Channel Analytics Agent Policy Handbook](/documents/sourcing-channel-analytics-agent-policy-handbook.md)

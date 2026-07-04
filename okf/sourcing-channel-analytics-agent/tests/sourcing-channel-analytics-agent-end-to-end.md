---
type: Eval Scenario
title: Run the Sourcing Channel Analytics Agent workflow for the current period. Cit...
description: "Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sourcing-channel-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [channel-data-collection](/queries/channel-data-collection.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_sourcing_channel_analytics_agent_policy_handbook](/tools/lookup-sourcing-channel-analytics-agent-policy-handbook.md)
- [action_ats_recommend](/tools/action-ats-recommend.md)

## Success rubric

Action recommend executed against ATS, with audit-trail entry and TA Lead notified of outcomes.

# Citations

- [Sourcing Channel Analytics Agent Policy Handbook](/documents/sourcing-channel-analytics-agent-policy-handbook.md)

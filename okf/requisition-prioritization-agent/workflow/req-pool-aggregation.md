---
type: Workflow Stage
title: Req Pool Aggregation
description: Aggregate all open requisitions with business context from Workday. Enrich with historical fill rates and difficulty metrics from BigQuery.
source_id: req_pool_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Req Pool Aggregation

Aggregate all open requisitions with business context from Workday. Enrich with historical fill rates and difficulty metrics from BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_requisition_prioritization_agent_policy_handbook](/tools/lookup-requisition-prioritization-agent-policy-handbook.md)

Next: [Recruiter Matching](/workflow/recruiter-matching.md)

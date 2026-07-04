---
type: Workflow Stage
title: "Diagnostic History & Prior-Work Check"
description: "Query Splunk log_events and their linked search_jobs for prior OTDR/reflectometry runs or crew actions on the same ne_id, so the agent never re-triggers a live diagnostic shot on a span already being worked."
source_id: diagnostic_history_prior_work_check
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Diagnostic History & Prior-Work Check

Query Splunk log_events and their linked search_jobs for prior OTDR/reflectometry runs or crew actions on the same ne_id, so the agent never re-triggers a live diagnostic shot on a span already being worked.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)

Next: [Runbook Validation & Citation](/workflow/runbook-validation-citation.md)

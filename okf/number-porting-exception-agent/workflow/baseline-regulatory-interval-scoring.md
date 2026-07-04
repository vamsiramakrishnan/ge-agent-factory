---
type: Workflow Stage
title: "Baseline & Regulatory Interval Scoring"
description: "Score the port-in against BigQuery's historical_metrics and analytics_events rejection-rate baseline, and check elapsed business time against the FCC one-business-day simple-port interval to set priority in the Porting Desk Analyst's queue."
source_id: baseline_regulatory_interval_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Regulatory Interval Scoring

Score the port-in against BigQuery's historical_metrics and analytics_events rejection-rate baseline, and check elapsed business time against the FCC one-business-day simple-port interval to set priority in the Porting Desk Analyst's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

Next: [Runbook & Reject-Code Evidence Validation](/workflow/runbook-reject-code-evidence-validation.md)

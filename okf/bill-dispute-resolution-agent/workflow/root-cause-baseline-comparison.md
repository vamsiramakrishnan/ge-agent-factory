---
type: Workflow Stage
title: "Root-cause & baseline comparison"
description: "Compare current-cycle BigQuery analytics_events variance_pct against historical_metrics baselines to determine whether the dispute is a one-off error or a recurring rate/proration defect."
source_id: root_cause_baseline_comparison
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-cause & baseline comparison

Compare current-cycle BigQuery analytics_events variance_pct against historical_metrics baselines to determine whether the dispute is a one-off error or a recurring rate/proration defect.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)

Next: [Adjudication & evidence-backed resolution drafting](/workflow/adjudication-evidence-backed-resolution-drafting.md)

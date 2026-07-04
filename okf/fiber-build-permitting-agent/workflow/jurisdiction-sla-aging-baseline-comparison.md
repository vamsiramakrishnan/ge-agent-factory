---
type: Workflow Stage
title: "Jurisdiction SLA Aging & Baseline Comparison"
description: "Run query_bigquery_analytics_events against historical_metrics and cached_aggregates to age each pending application against the jurisdiction's permit-turnaround baseline, scoring which submissions are approaching or past the SLA threshold."
source_id: jurisdiction_sla_aging_baseline_comparison
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Jurisdiction SLA Aging & Baseline Comparison

Run query_bigquery_analytics_events against historical_metrics and cached_aggregates to age each pending application against the jurisdiction's permit-turnaround baseline, scoring which submissions are approaching or past the SLA threshold.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)

Next: [Rules-Library & Playbook Evidence Validation](/workflow/rules-library-playbook-evidence-validation.md)

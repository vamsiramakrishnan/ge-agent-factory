---
type: Workflow Stage
title: "Analyze & Detect"
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Provisioning Engineer's queue."
source_id: analyze_detect
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Analyze & Detect

Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Provisioning Engineer's queue.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)

Next: [Validate Evidence](/workflow/validate-evidence.md)

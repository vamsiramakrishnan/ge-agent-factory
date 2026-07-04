---
type: Query Capability
title: "SRE dashboard refreshed in Looker with real-time SLO status, error budget bur..."
description: "SRE dashboard refreshed in Looker with real-time SLO status, error budget burn visualization, and AI commentary. Budget burn alerts sent when consumption exceeds threshold."
source_id: "dashboard-alerting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SRE dashboard refreshed in Looker with real-time SLO status, error budget burn visualization, and AI commentary. Budget burn alerts sent when consumption exceeds threshold.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)

## Runs in

- [dashboard_alerting](/workflow/dashboard-alerting.md)

## Evidence expected

- sql_result

## Evals

- [Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/slo-sli-monitor-reporter-end-to-end.md)

# Citations

- [SLO/SLI Monitor & Reporter Operations Runbook](/documents/slo-sli-monitor-reporter-runbook.md)

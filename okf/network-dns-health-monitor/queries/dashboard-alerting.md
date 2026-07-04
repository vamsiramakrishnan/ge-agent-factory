---
type: Query Capability
title: "Network health dashboard with real-time metrics, anomaly alerts, certificate ..."
description: "Network health dashboard with real-time metrics, anomaly alerts, certificate expiry countdown, and AI-generated impact analysis for infrastructure team."
source_id: "dashboard-alerting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Network health dashboard with real-time metrics, anomaly alerts, certificate expiry countdown, and AI-generated impact analysis for infrastructure team.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_network_dns_health_monitor_runbook](/tools/lookup-network-dns-health-monitor-runbook.md)

## Runs in

- [dashboard_alerting](/workflow/dashboard-alerting.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-dns-health-monitor-end-to-end.md)

# Citations

- [Network & DNS Health Monitor Operations Runbook](/documents/network-dns-health-monitor-runbook.md)

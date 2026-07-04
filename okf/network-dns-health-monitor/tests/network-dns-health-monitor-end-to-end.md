---
type: Eval Scenario
title: "Run the Network & DNS Health Monitor workflow for the current period. Cite th..."
description: "Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "network-dns-health-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [health-data-collection](/queries/health-data-collection.md)

## Mechanisms to call

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_route_53_billing_records](/tools/query-aws-route-53-billing-records.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_network_dns_health_monitor_runbook](/tools/lookup-network-dns-health-monitor-runbook.md)
- [action_aws_route_53_expire](/tools/action-aws-route-53-expire.md)

## Success rubric

Action expire executed against AWS Route 53, with audit-trail entry and Cloud Architect / SRE Manager notified of outcomes.

# Citations

- [Network & DNS Health Monitor Operations Runbook](/documents/network-dns-health-monitor-runbook.md)

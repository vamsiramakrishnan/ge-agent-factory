---
type: Workflow Stage
title: Health Data Collection
description: "Monitor network latency via Datadog, DNS resolution from Route 53, firewall rules from Palo Alto, and certificate expiry dates. Continuous ingestion with 1-minute granularity."
source_id: health_data_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Health Data Collection

Monitor network latency via Datadog, DNS resolution from Route 53, firewall rules from Palo Alto, and certificate expiry dates. Continuous ingestion with 1-minute granularity.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_route_53_billing_records](/tools/query-aws-route-53-billing-records.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [lookup_network_dns_health_monitor_runbook](/tools/lookup-network-dns-health-monitor-runbook.md)
- [action_aws_route_53_expire](/tools/action-aws-route-53-expire.md)

Next: [Business Impact Correlation](/workflow/business-impact-correlation.md)

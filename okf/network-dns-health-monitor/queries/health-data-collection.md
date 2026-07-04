---
type: Query Capability
title: "Monitor network latency via Datadog, DNS resolution from Route 53, firewall r..."
description: "Monitor network latency via Datadog, DNS resolution from Route 53, firewall rules from Palo Alto, and certificate expiry dates. Continuous ingestion with 1-minute granularity."
source_id: "health-data-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor network latency via Datadog, DNS resolution from Route 53, firewall rules from Palo Alto, and certificate expiry dates. Continuous ingestion with 1-minute granularity.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_route_53_billing_records](/tools/query-aws-route-53-billing-records.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [lookup_network_dns_health_monitor_runbook](/tools/lookup-network-dns-health-monitor-runbook.md)
- [action_aws_route_53_expire](/tools/action-aws-route-53-expire.md)

## Runs in

- [health_data_collection](/workflow/health-data-collection.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-dns-health-monitor-end-to-end.md)

# Citations

- [Network & DNS Health Monitor Operations Runbook](/documents/network-dns-health-monitor-runbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-network-dns-health-monitor-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [network-dns-health-monitor-end-to-end](/tests/network-dns-health-monitor-end-to-end.md)


## Mechanisms

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_route_53_billing_records](/tools/query-aws-route-53-billing-records.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_network_dns_health_monitor_runbook](/tools/lookup-network-dns-health-monitor-runbook.md)
- [action_aws_route_53_expire](/tools/action-aws-route-53-expire.md)

## Entities that must be referenced

- alerts
- billing_records
- palo_alto_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute expire without two-system evidence

# Citations

- [network-dns-health-monitor-runbook](/documents/network-dns-health-monitor-runbook.md)

---
type: Workflow Stage
title: Service History Correlation
description: "Correlate queue_metrics and agent_schedules from Genesys Cloud CX with analytics_events and historical_metrics baselines in BigQuery to determine whether the account was let down by an isolated agent interaction or a systemic queue-level gap."
source_id: service_history_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Service History Correlation

Correlate queue_metrics and agent_schedules from Genesys Cloud CX with analytics_events and historical_metrics baselines in BigQuery to determine whether the account was let down by an isolated agent interaction or a systemic queue-level gap.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

Next: [Remedy & Offer Governance Check](/workflow/remedy-offer-governance-check.md)

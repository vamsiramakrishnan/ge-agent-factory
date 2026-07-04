---
type: Workflow Stage
title: "Severity & Notification-Tier Scoring"
description: "Score the mapped impact against BigQuery historical_metrics baselines and cached_aggregates/analytics_events variance to set the notification tier (channel, cadence, and ETA confidence), gating every tier decision against the Proactive Outage Notification Orchestrator Service Assurance Runbook."
source_id: severity_notification_tier_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity & Notification-Tier Scoring

Score the mapped impact against BigQuery historical_metrics baselines and cached_aggregates/analytics_events variance to set the notification tier (channel, cadence, and ETA confidence), gating every tier decision against the Proactive Outage Notification Orchestrator Service Assurance Runbook.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)

Next: [Cause/ETA Narrative Drafting & Policy Citation](/workflow/cause-eta-narrative-drafting-policy-citation.md)

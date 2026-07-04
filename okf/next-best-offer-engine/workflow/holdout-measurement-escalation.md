---
type: Workflow Stage
title: "Holdout Measurement & Escalation"
description: "Compare treatment-group redemption in analytics_events against the historical_metrics holdout cohort, retire offers that fail to beat holdout, and escalate budget, fraud-velocity, or stale-evidence exceptions to the CRM Manager per the Execution Playbook."
source_id: holdout_measurement_escalation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Holdout Measurement & Escalation

Compare treatment-group redemption in analytics_events against the historical_metrics holdout cohort, retire offers that fail to beat holdout, and escalate budget, fraud-velocity, or stale-evidence exceptions to the CRM Manager per the Execution Playbook.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

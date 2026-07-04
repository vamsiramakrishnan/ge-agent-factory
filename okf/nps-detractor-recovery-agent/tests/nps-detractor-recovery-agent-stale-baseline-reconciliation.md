---
type: Eval Scenario
title: Account 84213097 submitted a detractor satisfaction_scores response (score 2)...
description: "Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days."
source_id: "nps-detractor-recovery-agent-stale-baseline-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days.

## Validates

- [service-history-correlation](/queries/service-history-correlation.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [NPS Detractor Recovery Agent Service Assurance Runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)

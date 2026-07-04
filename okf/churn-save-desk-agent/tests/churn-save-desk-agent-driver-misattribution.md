---
type: Eval Scenario
title: Account 48213077 (interaction_id 612044501) called in with intent=cancel_requ...
description: "Account 48213077 (interaction_id 612044501) called in with intent=cancel_request on 2026-07-02. The rep's agent_notes say 'customer says internet keeps dropping' but queue_metrics for the retention queue on that date shows service_level_80_20_pct at 91.4% and abandon_rate_pct at 2.1% — no service degradation. Before recommending a save offer, reconcile the stated complaint against the queue telemetry and tell me what's actually driving this cancellation and what offer to lead with."
source_id: "churn-save-desk-agent-driver-misattribution"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account 48213077 (interaction_id 612044501) called in with intent=cancel_request on 2026-07-02. The rep's agent_notes say 'customer says internet keeps dropping' but queue_metrics for the retention queue on that date shows service_level_80_20_pct at 91.4% and abandon_rate_pct at 2.1% — no service degradation. Before recommending a save offer, reconcile the stated complaint against the queue telemetry and tell me what's actually driving this cancellation and what offer to lead with.

## Validates

- [churn-driver-clv-triangulation](/queries/churn-driver-clv-triangulation.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Churn Save Desk Agent Service Assurance Runbook](/documents/churn-save-desk-agent-assurance-runbook.md)
- [Retention Offer Rate Card & Approval Authority Schedule](/documents/retention-offer-rate-schedule.md)

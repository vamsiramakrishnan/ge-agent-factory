---
type: Proof Obligation
title: "Golden eval obligation — Account 48213077 (interaction_id 612044501) called in with intent=cancel_request on 2026-07-02. The rep's agent_notes say 'customer says internet keeps dropping' but queue_metrics for the retention queue on that date shows service_level_80_20_pct at 91.4% and abandon_rate_pct at 2.1% — no service degradation. Before recommending a save offer, reconcile the stated complaint against the queue telemetry and tell me what's actually driving this cancellation and what offer to lead with."
description: golden eval proof obligation
source_id: "eval-churn-save-desk-agent-driver-misattribution"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Account 48213077 (interaction_id 612044501) called in with intent=cancel_request on 2026-07-02. The rep's agent_notes say 'customer says internet keeps dropping' but queue_metrics for the retention queue on that date shows service_level_80_20_pct at 91.4% and abandon_rate_pct at 2.1% — no service degradation. Before recommending a save offer, reconcile the stated complaint against the queue telemetry and tell me what's actually driving this cancellation and what offer to lead with.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [churn-save-desk-agent-driver-misattribution](/tests/churn-save-desk-agent-driver-misattribution.md)


## Mechanisms

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)

## Entities that must be referenced

- customer_interactions
- queue_metrics

## Forbidden behaviors

- accepting the rep's stated network complaint at face value without checking queue_metrics
- recommending a device or service-fix credit when the queue telemetry contradicts a network-driven churn story

# Citations

- [churn-save-desk-agent-assurance-runbook](/documents/churn-save-desk-agent-assurance-runbook.md)
- [retention-offer-rate-schedule](/documents/retention-offer-rate-schedule.md)

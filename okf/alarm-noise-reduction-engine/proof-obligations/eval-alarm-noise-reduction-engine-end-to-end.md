---
type: Proof Obligation
title: "Golden eval obligation — Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-alarm-noise-reduction-engine-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [alarm-noise-reduction-engine-end-to-end](/tests/alarm-noise-reduction-engine-end-to-end.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)
- [action_ericsson_network_manager_route](/tools/action-ericsson-network-manager-route.md)

## Entities that must be referenced

- network_alarms
- analytics_events
- log_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [alarm-noise-reduction-engine-assurance-runbook](/documents/alarm-noise-reduction-engine-assurance-runbook.md)

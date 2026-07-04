---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull performance_counters (RSRP, SINR, RRC setup success, VoLTE drop rate) and network_alarms for the target clusters from Ericsson Network Manager.](/queries/counter-alarm-ingestion.md)
- [Compare current performance_counters against historical_metrics and analytics_events in BigQuery to rank the worst-offending cell_sites by drop call rate and handover failure rate drift.](/queries/cluster-baseline-comparison.md)
- [Score candidate tilt, power, and mobility/handover-threshold changes per cell_sites record against predicted KPI impact, cross-checking analytics_events for conflicting coverage, capacity, or energy-saving changes already in flight on the same cell.](/queries/parameter-change-candidate-scoring.md)
- [Cite the RAN Parameter Optimization Agent Service Assurance Runbook and the RAN Parameter Change Control & Rollback Playbook to confirm the change window, staleness threshold, and two-system evidence requirement before any recommend call.](/queries/evidence-change-window-gating.md)
- [Execute action_ericsson_network_manager_recommend against Ericsson Network Manager with a full audit trail, staging the tilt/power/mobility change for RF Optimization Engineer sign-off.](/queries/recommend-stage-for-approval.md)
- [Re-query performance_counters within 24 hours and publish results to Looker dashboards; automatically roll back any change where accessibility or retention KPIs regress past the runbook threshold.](/queries/post-change-verification-rollback.md)

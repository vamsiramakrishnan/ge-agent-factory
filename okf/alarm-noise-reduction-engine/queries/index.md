---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull raw network_alarms and cell_sites records from Ericsson Network Manager via query_ericsson_network_manager_network_alarms, deduplicating flapping and sympathetic events before correlation begins.](/queries/alarm-storm-intake-deduplication.md)
- [Correlate alarms by ne_id/site_id topology and first_occurrence timing, cross-referencing Splunk log_events and search_jobs through query_splunk_log_events to chain child alarms to a single root cause.](/queries/topology-timing-correlation.md)
- [Compare current severity and probable_cause distributions against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to score exception significance and prioritize the NOC Engineer's queue.](/queries/baseline-deviation-severity-scoring.md)
- [Cite the governing sections of the Alarm Noise Reduction Engine Service Assurance Runbook via lookup_alarm_noise_reduction_engine_assurance_runbook before any suppression, ticketing, or routing recommendation is finalized.](/queries/runbook-gated-evidence-validation.md)
- [Execute action_ericsson_network_manager_route to open one enriched incident per root cause, attach impact scope, and write the generated_audit_trail entry for the owning domain team.](/queries/incident-creation-routing-audit.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull vibration_mm_s, temperature_c, pressure_bar, and motor_current_amps sensor_readings plus asset_tag_hierarchies from the OSIsoft PI System and resolve each tag_id to its asset_registry_entries record in IBM Maximo.](/queries/condition-signal-intake.md)
- [Score the live sensor_readings against historical_metrics and cached_aggregates baselines in BigQuery to quantify departure from the asset's healthy signature and estimate remaining useful life.](/queries/degradation-scoring-rul-estimation.md)
- [Cross-reference failure_codes and downtime_events for the asset_number to identify the probable failure_mode and failure_mechanism, and check occurrences_ytd for a repeat-failure pattern.](/queries/failure-mode-triage.md)
- [Validate the finding against the Predictive Asset Failure Monitor Standard Operating Procedure and the criticality_ranking in asset_registry_entries, citing governing sections before any recommendation is issued.](/queries/sop-severity-gate.md)
- [Execute action_ibm_maximo_recommend to raise a prioritized condition-based maintenance_work_orders record in IBM Maximo, or hand off to the Reliability Engineer when an escalation rule fires.](/queries/work-order-issuance-escalation.md)

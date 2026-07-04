---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Stream in-line quality_checks measurements and machine_events from Siemens Opcenter MES alongside inspection_lots from SAP S/4HANA QM, binding each measured_value to its characteristic, production_order, and spec limits via query_siemens_opcenter_mes_production_orders and query_sap_s_4hana_qm_inspection_lots.](/queries/signal-ingestion-characteristic-binding.md)
- [Evaluate each quality_checks time series per characteristic against Western Electric zone rules (e.g., 4-of-5 consecutive points beyond 1 sigma on the same side of center) and cpk trend, flagging candidate SPC signals on the inspection_lots still awaiting usage_decision.](/queries/western-electric-run-rule-evaluation.md)
- [Query historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to compare current cpk and variance_pct against per-characteristic capability baselines, separating true process drift from measurement noise or a machine_events-driven excursion (fault_alarm, e_stop).](/queries/baseline-capability-reconciliation.md)
- [Cite the SPC Drift Detection Monitor Standard Operating Procedure and the CTQ control plan via lookup_spc_drift_detection_monitor_sop, then invoke action_sap_s_4hana_qm_recommend to propose a hold or disposition on the affected inspection_lots only when at least two source systems corroborate the drift.](/queries/evidence-gated-hold-recommendation.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull inspection_lots and nonconformance_records from SAP S/4HANA QM via query_sap_s_4hana_qm_inspection_lots and match each lot to its purchase_orders and vendors record from SAP S/4HANA MM via query_sap_s_4hana_mm_purchase_orders so every rejection traces to a named supplier.](/queries/vendor-lot-reconciliation.md)
- [Calculate incoming inspection PPM, lot rejection rate, and capa_actions closure velocity, benchmarking current-quarter numbers against historical_metrics and analytics_events pulled from BigQuery via query_bigquery_analytics_events.](/queries/ppm-capa-trend-compute.md)
- [Score each vendor into a risk tier using nonconformance_records severity mix, capa_actions effectiveness_verified rate, and inspection_lots accepted_with_deviation frequency, citing control-limit thresholds from the Supplier Quality Scorecard Engine SOP and the Supplier Risk Classification Policy via lookup_supplier_quality_scorecard_engine_sop.](/queries/risk-tiering-improvement-plan-flagging.md)
- [Cross-check every PPM movement, tier change, and improvement-plan recommendation against the governing SOP and the Risk Classification Policy before any narrative claim is issued, holding action_sap_s_4hana_qm_publish until two-system evidence is confirmed.](/queries/scorecard-evidence-gate.md)
- [Draft the quarterly business review narrative, publish trend dashboards and metric_definitions to Looker via query_looker_dashboards, execute action_sap_s_4hana_qm_publish with a full audit trail in SAP S/4HANA QM, and escalate flagged suppliers to the Supplier Quality Engineer and Sourcing Manager.](/queries/qbr-publish-sourcing-handoff.md)

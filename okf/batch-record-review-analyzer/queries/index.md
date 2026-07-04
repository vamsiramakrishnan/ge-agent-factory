---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Trigger the moment a production_orders record moves to teco or confirmed in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders); pull the matching inspection_lots and quality_checks records for that material_number from SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots).](/queries/batch-closure-intake.md)
- [Compare each quality_checks measured_value and cpk against lower_spec_limit/upper_spec_limit, and check the inspection_lots aql_level, sample_size, and skip_lot flag, to isolate any characteristic reading outside its control limit before touching usage_decision.](/queries/spec-control-limit-screening.md)
- [Cross-check open nonconformance_records (severity, disposition, containment_complete) and capa_actions (status, effectiveness_verified) for the same material_number in SAP S/4HANA QM so a stale accepted usage_decision can't mask an unresolved deviation.](/queries/nc-capa-cross-reference.md)
- [Rank surfaced deviations against BigQuery historical_metrics and analytics_events variance_pct baselines (query_bigquery_historical_metrics, query_bigquery_analytics_events) to build the review-by-exception queue instead of re-checking clean entries.](/queries/exception-scoring-baseline-compare.md)
- [Cite the governing batch-record-review-analyzer-sop and EBR data-integrity policy sections (lookup_batch_record_review_analyzer_sop), then execute action_sap_s_4hana_qm_recommend with a full audit_record_id trail, escalating per the escalation rules instead of auto-releasing.](/queries/sop-gated-release-audit.md)

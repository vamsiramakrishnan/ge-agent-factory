---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the triggering record via query_ptc_windchill_plm_engineering_change_orders from PTC Windchill PLM and classify it by change_class, change_reason, and effectivity_type before scoping the impact trace.](/queries/eco-intake-classification.md)
- [Walk bom_revisions and cad_document_records in PTC Windchill PLM via query_ptc_windchill_plm_bom_revisions and query_ptc_windchill_plm_cad_document_records to enumerate every affected parent assembly and released document tied to the ECO.](/queries/where-used-impact-trace.md)
- [Join the where-used set against open process_orders, work_center_confirmations, and material_stagings in SAP S/4HANA PP via query_sap_s_4hana_pp_process_orders, query_sap_s_4hana_pp_work_center_confirmations, and query_sap_s_4hana_pp_material_stagings to size WIP and on-hand exposure.](/queries/sap-production-inventory-cross-reference.md)
- [Score candidate effectivity_date options against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events to quantify the stranded-inventory and open-order cost trade-off for each date.](/queries/effectivity-stranded-cost-scoring.md)
- [Cite the ECO Impact Analysis Agent Standard Operating Procedure, and the export-control policy when itar_restricted or export_controlled documents are in scope, via lookup_eco_impact_analysis_agent_sop before any recommendation is issued.](/queries/sop-evidence-gate.md)
- [Execute action_ptc_windchill_plm_recommend in PTC Windchill PLM with a full audit trail, then draft the change-board impact summary and notify affected planners, buyers, and line engineers of the effectivity decision.](/queries/recommend-change-board-notification.md)

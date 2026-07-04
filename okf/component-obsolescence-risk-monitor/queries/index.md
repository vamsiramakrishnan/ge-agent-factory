---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query engineering_change_orders and bom_revisions from PTC Windchill PLM and cross-reference against purchase_orders and vendors in SAP S/4HANA MM to find every active product touched by a supplier end-of-life or lifecycle-risk signal.](/queries/eol-signal-bom-correlation.md)
- [Pull analytics_events and historical_metrics from BigQuery to compute remaining demand, current stock position, and the last-time-buy quantity required per affected part before the supplier's EOL cutoff.](/queries/exposure-last-time-buy-quantification.md)
- [Invoke lookup_component_obsolescence_risk_monitor_sop against the Component Obsolescence Risk Monitor SOP and the Export Control Classification & ITAR/EAR Technical Data Handling Policy to confirm control limits, staleness thresholds, and ITAR/EAR handling before any disposition is proposed.](/queries/sop-export-control-citation-gate.md)
- [Recommend last-time buy, alternate qualification, or redesign per part and, for Class 1 (form/fit/function) changes flagged on engineering_change_orders, route through the engineering change control board before calling action_ptc_windchill_plm_recommend.](/queries/disposition-recommendation-change-control-routing.md)
- [Execute action_ptc_windchill_plm_recommend in PTC Windchill PLM, emit the audit_record_id, and escalate effectivity conflicts, certification-envelope ECOs, or export-authorization mismatches to the Component Engineer, chief_engineer, change_analyst, or empowered_official.](/queries/action-execution-audit-trail-escalation.md)

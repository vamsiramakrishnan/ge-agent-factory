---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Detect a qualifying nonconformance_records entry against a lot in SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots), open a structured capa_actions workspace, and draft the initial problem statement from the defect_code and severity classification.](/queries/capa-notification-intake.md)
- [Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) for prior capa_actions closed against the same defect_code and material_number, and propose a reusable root-cause narrative instead of drafting from a blank page.](/queries/historical-precedent-matching.md)
- [Create and route containment, root_cause_analysis, and implementation tickets in ServiceNow (query_servicenow_tickets) with due_date and owner_name populated, tagged back to the parent capa_actions.capa_number and root_cause_method.](/queries/root-cause-task-routing.md)
- [Cross-check the proposed root_cause_method, disposition, and escalation path against the CAPA Orchestration Agent Standard Operating Procedure and the Nonconformance Disposition & Material Review Board Authority Matrix (lookup_capa_orchestration_agent_sop) before any recommendation is issued.](/queries/sop-severity-validation.md)
- [Monitor capa_actions.days_open against due_date and ServiceNow ticket sla_met status, and execute action_sap_s_4hana_qm_escalate with a full audit trail when a task stalls past the CAPA Orchestration Agent workflow's tolerance.](/queries/stalled-task-escalation.md)
- [Re-query nonconformance_records defect rates for the affected characteristic after a capa_actions record moves to effectiveness_check, and reopen the CAPA (status back to root_cause_analysis) via action_sap_s_4hana_qm_escalate if the failure mode recurs.](/queries/effectiveness-verification-reopen-gate.md)

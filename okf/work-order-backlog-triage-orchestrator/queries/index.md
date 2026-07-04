---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query maintenance_work_orders and asset_registry_entries from IBM Maximo, cross-reference open tickets and incidents in ServiceNow for the same asset_number, and merge duplicate requests raised against a single failing asset before they fan out to different technicians.](/queries/backlog-pull-duplicate-merge.md)
- [Score each maintenance_work_order against asset_registry_entries.criticality_ranking and failure_codes recurrence (occurrences_ytd, mean_time_between_failures_hours), weighting the result against the trailing trend in BigQuery analytics_events and historical_metrics.](/queries/criticality-failure-history-scoring.md)
- [Check work_order_status=awaiting_parts records against BigQuery cached_aggregates parts-lead-time figures and technician availability, then bundle multiple maintenance_work_orders on the same asset_number into a single crew visit.](/queries/parts-crew-feasibility-check.md)
- [Look up the Work Order Backlog Triage Orchestrator Standard Operating Procedure and the Preventive Maintenance Interval & Regulatory Compliance Schedule to gate any escalate decision, then execute action_ibm_maximo_escalate in IBM Maximo for safety-critical work orders aging past threshold, routing through ServiceNow incidents to the Maintenance Supervisor.](/queries/sop-gated-escalation.md)
- [Draft the weekly schedule proposal against the Maintenance backlog and Schedule compliance KPI baselines, publish the generated_audit_trail and kpi_summary to BigQuery, and hand the Monday planning packet to the Maintenance Supervisor.](/queries/weekly-schedule-proposal-audit-publish.md)

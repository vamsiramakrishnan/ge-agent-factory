---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query engineering_change_orders and cad_document_records lifecycle_state in PTC Windchill PLM (query_ptc_windchill_plm_engineering_change_orders) against open issues in Jira (query_jira_issues) to reconcile what the gate checklist claims is done versus what is actually released or still in_work.](/queries/gate-deliverable-reconciliation.md)
- [Compare current completion velocity against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to project each deliverable's finish date against the gate date and score it green/yellow/red while there is still runway to recover.](/queries/burn-down-trend-readiness-scoring.md)
- [Cross-check each engineering_change_orders record's change_class, effectivity_type, and export_controlled flag, and each cad_document_records itar_restricted flag, against the NPI Launch Readiness Orchestrator Standard Operating Procedure (lookup_npi_launch_readiness_orchestrator_sop) to catch Class 1 changes, effectivity conflicts, and export-control access mismatches before they surface at the gate.](/queries/change-class-export-control-gate-check.md)
- [Execute action_ptc_windchill_plm_escalate against PTC Windchill PLM with a full audit trail when a deliverable's projected finish date slips past the gate date, routing the exception to the accountable function lead named on the engineering_change_orders.requested_by or issues.owner field.](/queries/critical-path-escalation.md)
- [Assemble the readiness pack from reconciled engineering_change_orders, bom_revisions, and issues status, cite the governing SOP sections (lookup_npi_launch_readiness_orchestrator_sop) for every open exception, and publish it to the NPI Program Manager ahead of the scheduled gate review.](/queries/gate-review-readiness-pack-compilation.md)

---
type: Query Capability
title: Query engineering_change_orders and cad_document_records lifecycle_state in P...
description: Query engineering_change_orders and cad_document_records lifecycle_state in PTC Windchill PLM (query_ptc_windchill_plm_engineering_change_orders) against open issues in Jira (query_jira_issues) to reconcile what the gate checklist claims is done versus what is actually released or still in_work.
source_id: "gate-deliverable-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query engineering_change_orders and cad_document_records lifecycle_state in PTC Windchill PLM (query_ptc_windchill_plm_engineering_change_orders) against open issues in Jira (query_jira_issues) to reconcile what the gate checklist claims is done versus what is actually released or still in_work.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Runs in

- [gate_deliverable_reconciliation](/workflow/gate-deliverable-reconciliation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/npi-launch-readiness-orchestrator-end-to-end.md)
- [Gate review for Program Falcon-7 is in 9 days. Jira issue NPI-4821 (linked to ECO-24417, owner Priya Raghunathan) shows status 'closed' with a note that the drawing package is done. But PTC Windchill CAD document 8341206 rev C tied to that ECO still shows lifecycle_state 'in_review' and checked_out=true as of this morning. The program office wants this deliverable marked green in tomorrow's readiness pack. Should it be?](/tests/npi-launch-readiness-orchestrator-status-mismatch-gate.md)
- [Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?](/tests/npi-launch-readiness-orchestrator-recovery-runway-escalation.md)

# Citations

- [NPI Launch Readiness Orchestrator Standard Operating Procedure](/documents/npi-launch-readiness-orchestrator-sop.md)
- [Engineering Change Control Board Authority & Effectivity Matrix](/documents/eccb-authority-effectivity-matrix.md)

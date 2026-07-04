---
type: Workflow Stage
title: Gate Deliverable Reconciliation
description: Query engineering_change_orders and cad_document_records lifecycle_state in PTC Windchill PLM (query_ptc_windchill_plm_engineering_change_orders) against open issues in Jira (query_jira_issues) to reconcile what the gate checklist claims is done versus what is actually released or still in_work.
source_id: gate_deliverable_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Gate Deliverable Reconciliation

Query engineering_change_orders and cad_document_records lifecycle_state in PTC Windchill PLM (query_ptc_windchill_plm_engineering_change_orders) against open issues in Jira (query_jira_issues) to reconcile what the gate checklist claims is done versus what is actually released or still in_work.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [Burn-Down Trend & Readiness Scoring](/workflow/burn-down-trend-readiness-scoring.md)

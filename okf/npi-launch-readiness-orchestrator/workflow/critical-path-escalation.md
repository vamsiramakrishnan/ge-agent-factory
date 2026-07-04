---
type: Workflow Stage
title: "Critical-Path Escalation"
description: "Execute action_ptc_windchill_plm_escalate against PTC Windchill PLM with a full audit trail when a deliverable's projected finish date slips past the gate date, routing the exception to the accountable function lead named on the engineering_change_orders.requested_by or issues.owner field."
source_id: critical_path_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Critical-Path Escalation

Execute action_ptc_windchill_plm_escalate against PTC Windchill PLM with a full audit trail when a deliverable's projected finish date slips past the gate date, routing the exception to the accountable function lead named on the engineering_change_orders.requested_by or issues.owner field.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [Gate Review Readiness Pack Compilation](/workflow/gate-review-readiness-pack-compilation.md)

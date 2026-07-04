---
type: Workflow Stage
title: "Root-Cause & Task Routing"
description: "Create and route containment, root_cause_analysis, and implementation tickets in ServiceNow (query_servicenow_tickets) with due_date and owner_name populated, tagged back to the parent capa_actions.capa_number and root_cause_method."
source_id: root_cause_task_routing
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-Cause & Task Routing

Create and route containment, root_cause_analysis, and implementation tickets in ServiceNow (query_servicenow_tickets) with due_date and owner_name populated, tagged back to the parent capa_actions.capa_number and root_cause_method.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)

Next: [SOP & Severity Validation](/workflow/sop-severity-validation.md)

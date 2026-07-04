---
type: Workflow Stage
title: "Stalled-Task Escalation"
description: "Monitor capa_actions.days_open against due_date and ServiceNow ticket sla_met status, and execute action_sap_s_4hana_qm_escalate with a full audit trail when a task stalls past the CAPA Orchestration Agent workflow's tolerance."
source_id: stalled_task_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Stalled-Task Escalation

Monitor capa_actions.days_open against due_date and ServiceNow ticket sla_met status, and execute action_sap_s_4hana_qm_escalate with a full audit trail when a task stalls past the CAPA Orchestration Agent workflow's tolerance.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

Next: [Effectiveness Verification & Reopen Gate](/workflow/effectiveness-verification-reopen-gate.md)

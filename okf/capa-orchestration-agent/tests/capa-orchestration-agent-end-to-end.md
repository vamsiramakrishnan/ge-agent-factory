---
type: Eval Scenario
title: Run the CAPA Orchestration Agent workflow for the current period. Cite the re...
description: "Run the CAPA Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "capa-orchestration-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the CAPA Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [stalled-task-escalation](/queries/stalled-task-escalation.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

## Success rubric

Action escalate executed against SAP S/4HANA QM, with audit-trail entry and Quality Manager notified of outcomes.

# Citations

- [CAPA Orchestration Agent Standard Operating Procedure](/documents/capa-orchestration-agent-sop.md)

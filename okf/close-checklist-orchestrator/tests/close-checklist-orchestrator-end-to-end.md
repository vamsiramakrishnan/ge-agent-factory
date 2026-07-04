---
type: Eval Scenario
title: Run the Close Checklist Orchestrator workflow for the current period. Cite th...
description: "Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "close-checklist-orchestrator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [escalation-reporting](/queries/escalation-reporting.md)

## Mechanisms to call

- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_close_checklist_orchestrator_controls_playbook](/tools/lookup-close-checklist-orchestrator-controls-playbook.md)
- [action_blackline_escalate](/tools/action-blackline-escalate.md)

## Success rubric

Action escalate executed against BlackLine, with audit-trail entry and Controller notified of outcomes.

# Citations

- [Close Checklist Orchestrator Controls Playbook](/documents/close-checklist-orchestrator-controls-playbook.md)

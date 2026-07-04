---
type: Eval Scenario
title: Run the Audit Finding Tracker workflow for the current period. Cite the relev...
description: "Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "audit-finding-tracker-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [automated-deadline-tracking-with-escalation-ensures-findings-don](/queries/automated-deadline-tracking-with-escalation-ensures-findings-don.md)

## Mechanisms to call

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_audit_finding_tracker_controls_playbook](/tools/lookup-audit-finding-tracker-controls-playbook.md)
- [action_auditboard_execute](/tools/action-auditboard-execute.md)

## Success rubric

Action execute executed against AuditBoard, with audit-trail entry and Chief Audit Executive notified of outcomes.

# Citations

- [Audit Finding Tracker Controls Playbook](/documents/audit-finding-tracker-controls-playbook.md)

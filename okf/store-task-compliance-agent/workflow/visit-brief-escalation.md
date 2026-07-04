---
type: Workflow Stage
title: "Visit Brief & Escalation"
description: "Assemble the District Manager's per-store visit brief with exceptions, trends, and coaching points, and fire action_ukg_dimensions_escalate in UKG Dimensions with a full audit trail for any exception that clears the two-system evidence gate."
source_id: visit_brief_escalation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Visit Brief & Escalation

Assemble the District Manager's per-store visit brief with exceptions, trends, and coaching points, and fire action_ukg_dimensions_escalate in UKG Dimensions with a full audit trail for any exception that clears the two-system evidence gate.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)
- [action_ukg_dimensions_escalate](/tools/action-ukg-dimensions-escalate.md)

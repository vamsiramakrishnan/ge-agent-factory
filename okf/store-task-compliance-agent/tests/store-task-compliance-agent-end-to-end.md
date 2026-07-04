---
type: Eval Scenario
title: Run the Store Task Compliance Agent workflow for the current period. Cite the...
description: "Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "store-task-compliance-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [task-schedule-pull](/queries/task-schedule-pull.md)

## Mechanisms to call

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)
- [action_ukg_dimensions_escalate](/tools/action-ukg-dimensions-escalate.md)

## Success rubric

Action escalate executed against UKG Dimensions, with audit-trail entry and District Manager notified of outcomes.

# Citations

- [Store Task Compliance Agent Retail Execution Playbook](/documents/store-task-compliance-agent-execution-playbook.md)

---
type: Eval Scenario
title: While running the Store Task Compliance Agent workflow you encounter this con...
description: "While running the Store Task Compliance Agent workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end."
source_id: "store-task-compliance-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Store Task Compliance Agent workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Task Compliance Agent Retail Execution Playbook](/documents/store-task-compliance-agent-execution-playbook.md)

---
type: Eval Scenario
title: While running the POS Exception Triage Agent workflow you encounter this cond...
description: "While running the POS Exception Triage Agent workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end."
source_id: "pos-exception-triage-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the POS Exception Triage Agent workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end.

## Validates

- [ticket-correlation-dedup](/queries/ticket-correlation-dedup.md)

## Mechanisms to call

- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [POS Exception Triage Agent Retail Execution Playbook](/documents/pos-exception-triage-agent-execution-playbook.md)

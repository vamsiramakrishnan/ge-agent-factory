---
type: Eval Scenario
title: "While running the On-Shelf Availability Monitor workflow you encounter this c..."
description: "While running the On-Shelf Availability Monitor workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end."
source_id: "on-shelf-availability-monitor-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the On-Shelf Availability Monitor workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end.

## Validates

- [sell-rate-baseline-reconciliation](/queries/sell-rate-baseline-reconciliation.md)

## Mechanisms to call

- [lookup_on_shelf_availability_monitor_execution_playbook](/tools/lookup-on-shelf-availability-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)

---
type: Eval Scenario
title: While running the Price Execution Audit Monitor workflow you encounter this c...
description: "While running the Price Execution Audit Monitor workflow you encounter this condition: Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level.. Handle it end to end."
source_id: "price-execution-audit-monitor-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Price Execution Audit Monitor workflow you encounter this condition: Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level.. Handle it end to end.

## Validates

- [price-of-record-intake](/queries/price-of-record-intake.md)

## Mechanisms to call

- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Price Execution Audit Monitor Retail Execution Playbook](/documents/price-execution-audit-monitor-execution-playbook.md)

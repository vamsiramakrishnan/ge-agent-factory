---
type: Eval Scenario
title: While running the Inbound PO ETA Monitor workflow you encounter this conditio...
description: "While running the Inbound PO ETA Monitor workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end."
source_id: "inbound-po-eta-monitor-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Inbound PO ETA Monitor workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end.

## Validates

- [inbound-po-wave-ingestion](/queries/inbound-po-wave-ingestion.md)

## Mechanisms to call

- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Inbound PO ETA Monitor Retail Execution Playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)

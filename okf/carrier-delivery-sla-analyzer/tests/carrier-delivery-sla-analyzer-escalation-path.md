---
type: Eval Scenario
title: While running the Carrier Delivery SLA Analyzer workflow you encounter this c...
description: "While running the Carrier Delivery SLA Analyzer workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end."
source_id: "carrier-delivery-sla-analyzer-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Carrier Delivery SLA Analyzer workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)

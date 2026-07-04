---
type: Eval Scenario
title: While running the Cart Abandonment Recovery Orchestrator workflow you encount...
description: "While running the Cart Abandonment Recovery Orchestrator workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end."
source_id: "cart-abandonment-recovery-orchestrator-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Cart Abandonment Recovery Orchestrator workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)

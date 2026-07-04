---
type: Eval Scenario
title: While running the Order Fallout Resolution Agent workflow you encounter this ...
description: "While running the Order Fallout Resolution Agent workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end."
source_id: "order-fallout-resolution-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Order Fallout Resolution Agent workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end.

## Validates

- [fallout-queue-intake-correlation](/queries/fallout-queue-intake-correlation.md)

## Mechanisms to call

- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Order Fallout Resolution Agent Service Assurance Runbook](/documents/order-fallout-resolution-agent-assurance-runbook.md)

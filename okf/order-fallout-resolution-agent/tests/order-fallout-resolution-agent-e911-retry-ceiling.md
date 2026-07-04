---
type: Eval Scenario
title: "Service order 74208831 (new_connect, consumer) has been stuck for three days...."
description: "Service order 74208831 (new_connect, consumer) has been stuck for three days. Its e911_address_load provisioning task shows retry_count = 3 with error_code = address_invalid, and there's no ServiceNow incident open yet. The customer is calling asking why their line isn't active — can we just push it through manually today?"
source_id: "order-fallout-resolution-agent-e911-retry-ceiling"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Service order 74208831 (new_connect, consumer) has been stuck for three days. Its e911_address_load provisioning task shows retry_count = 3 with error_code = address_invalid, and there's no ServiceNow incident open yet. The customer is calling asking why their line isn't active — can we just push it through manually today?

## Validates

- [fallout-queue-intake-correlation](/queries/fallout-queue-intake-correlation.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Order Fallout Resolution Agent Service Assurance Runbook](/documents/order-fallout-resolution-agent-assurance-runbook.md)
- [LNP Port Timeliness & E911 Dispatchable Location Compliance Bulletin](/documents/order-fallout-resolution-agent-lnp-e911-compliance-bulletin.md)

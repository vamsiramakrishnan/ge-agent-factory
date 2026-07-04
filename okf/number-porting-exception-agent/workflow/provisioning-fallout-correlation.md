---
type: Workflow Stage
title: Provisioning Fallout Correlation
description: "Cross-reference provisioning_tasks (e911_address_load, switch_translation, hlr_hss_update) and network_inventory_items admin_state/vendor in Netcracker Service Orchestration to determine whether the reject originates in the losing carrier's CSR or in the winning carrier's own fallout."
source_id: provisioning_fallout_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Provisioning Fallout Correlation

Cross-reference provisioning_tasks (e911_address_load, switch_translation, hlr_hss_update) and network_inventory_items admin_state/vendor in Netcracker Service Orchestration to determine whether the reject originates in the losing carrier's CSR or in the winning carrier's own fallout.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Baseline & Regulatory Interval Scoring](/workflow/baseline-regulatory-interval-scoring.md)

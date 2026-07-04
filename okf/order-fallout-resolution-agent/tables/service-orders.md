---
type: Data Entity
title: service_orders
description: Data entity service_orders owned by Netcracker Service Orchestration.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# service_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| order_number | number | required |
| order_type | enum | required; values: new_connect, port_in, change_of_plan, disconnect, move |
| order_status | enum | required; values: entered, in_flight, fallout, completed, cancelled |
| fallout_status | enum | required; values: none, address_validation, switch_reject, lnp_delay, inventory_shortfall, manual_task_pending |
| provisioning_system | enum | required; values: amdocs_oms, netcracker_rom, salesforce_industries, legacy_axiom |
| customer_segment | enum | required; values: consumer, smb, enterprise, wholesale |
| due_date | date | required |
| sla_breached | boolean | required |
| expedite_flag | boolean |  |

# Citations

- Owned by [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

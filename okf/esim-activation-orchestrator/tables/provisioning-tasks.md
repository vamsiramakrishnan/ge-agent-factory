---
type: Data Entity
title: provisioning_tasks
description: Data entity provisioning_tasks owned by Netcracker Service Orchestration.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# provisioning_tasks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| task_id | number | required |
| order_number | number | required |
| task_type | enum | required; values: hlr_hss_update, e911_address_load, olt_port_assign, cpe_config_push, number_activation, switch_translation |
| task_status | enum | required; values: queued, in_progress, completed, failed, manual_hold |
| target_ne_id | number | required |
| retry_count | number | required |
| error_code | enum | values: none, ne_timeout, data_mismatch, port_unavailable, address_invalid |
| completed_date | date |  |

# Citations

- Owned by [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

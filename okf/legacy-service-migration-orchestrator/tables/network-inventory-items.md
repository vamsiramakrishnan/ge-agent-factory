---
type: Data Entity
title: network_inventory_items
description: Data entity network_inventory_items owned by Netcracker Service Orchestration.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# network_inventory_items

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| ne_id | number | required |
| element_type | enum | required; values: gnodeb, enodeb, olt, core_router, upf, dwdm_node, microwave_idu |
| vendor | enum | required; values: ericsson, nokia, samsung, ciena, juniper, adtran |
| site_id | number | required |
| admin_state | enum | required; values: in_service, planned, maintenance, decommission_pending |
| software_version | enum | required; values: r22a, r23q1, r23q3, r24q1, legacy_eol |
| capacity_utilization_pct | float | required |
| install_date | date | required |
| under_support_contract | boolean | required |

# Citations

- Owned by [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

---
type: Data Entity
title: network_alarms
description: Data entity network_alarms owned by Ericsson Network Manager.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# network_alarms

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| alarm_id | number | required |
| ne_id | number | required |
| site_id | number | required |
| alarm_type | enum | required; values: link_down, high_ber, power_failure, vswr_alarm, sync_loss, temperature |
| severity | enum | required; values: critical, major, minor, warning |
| probable_cause | enum | required; values: fiber_cut, rectifier_failure, antenna_feeder_fault, gps_holdover, hvac_failure, backhaul_congestion |
| first_occurrence | date | required |
| clear_status | enum | required; values: active, acknowledged, cleared |
| ticket_number | number |  |

# Citations

- Owned by [Ericsson Network Manager](/systems/ericsson-network-manager.md)

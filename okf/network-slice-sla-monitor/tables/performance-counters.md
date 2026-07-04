---
type: Data Entity
title: performance_counters
description: Data entity performance_counters owned by Ericsson Network Manager.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# performance_counters

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| cell_id | number | required |
| ne_id | number | required |
| interval_start | date | required |
| prb_utilization_dl_pct | float | required |
| rsrp_avg_dbm | float | required |
| sinr_avg_db | float | required |
| rrc_setup_success_pct | float | required |
| volte_drop_rate_pct | float | required |
| cell_availability_pct | float | required |

# Citations

- Owned by [Ericsson Network Manager](/systems/ericsson-network-manager.md)

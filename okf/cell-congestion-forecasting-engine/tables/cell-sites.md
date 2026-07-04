---
type: Data Entity
title: cell_sites
description: Data entity cell_sites owned by Ericsson Network Manager.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# cell_sites

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| site_id | number | required |
| market | enum | required; values: dallas_ftw, chicago_metro, ny_metro, la_basin, atlanta_south, denver_front_range |
| site_type | enum | required; values: macro, small_cell, rooftop, das, cow |
| tower_owner | enum | required; values: crown_castle, american_tower, sba_communications, self_owned |
| backhaul_type | enum | required; values: dark_fiber, lit_ethernet, microwave, legacy_tdm |
| structural_height_ft | number | required |
| battery_runtime_hours | float | required |
| on_air_date | date | required |
| e911_phase2_compliant | boolean | required |

# Citations

- Owned by [Ericsson Network Manager](/systems/ericsson-network-manager.md)

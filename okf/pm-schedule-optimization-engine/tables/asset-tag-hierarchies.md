---
type: Data Entity
title: asset_tag_hierarchies
description: Data entity asset_tag_hierarchies owned by OSIsoft PI System.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# asset_tag_hierarchies

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| tag_id | number | required |
| asset_number | number | required |
| hierarchy_level | enum | required; values: enterprise, site, area, line, cell, equipment_unit |
| parent_tag_id | number |  |
| site | enum | required; values: 1010, 1020, 2040, 3100 |
| functional_location_active | boolean | required |
| tag_description | lorem.sentence |  |

# Citations

- Owned by [OSIsoft PI System](/systems/osisoft-pi-system.md)

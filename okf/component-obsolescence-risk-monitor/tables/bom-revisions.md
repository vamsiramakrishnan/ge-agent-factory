---
type: Data Entity
title: bom_revisions
description: Data entity bom_revisions owned by PTC Windchill PLM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# bom_revisions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| bom_number | number | required |
| parent_material_number | number | required |
| revision_level | enum | required; values: A, B, C, D, E, F |
| eco_number | number | required |
| component_count | number | required |
| phantom_assembly | boolean | required |
| bom_usage | enum | required; values: production, engineering, costing, service |
| valid_from | date | required |

# Citations

- Owned by [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

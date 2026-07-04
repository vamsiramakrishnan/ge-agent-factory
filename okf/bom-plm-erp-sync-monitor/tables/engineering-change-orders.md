---
type: Data Entity
title: engineering_change_orders
description: Data entity engineering_change_orders owned by PTC Windchill PLM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# engineering_change_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| eco_number | number | required |
| change_class | enum | required; values: class_1_form_fit_function, class_2_minor, document_only |
| change_reason | enum | required; values: design_defect, cost_reduction, supplier_obsolescence, customer_request, regulatory, manufacturability |
| effectivity_type | enum | required; values: serial_number, date, lot, immediate_use_up |
| effectivity_date | date | required |
| affected_item_count | number | required |
| export_controlled | boolean | required |
| approval_status | enum | required; values: draft, in_review, approved, released, rejected |
| requested_by | person.fullName | required |

# Citations

- Owned by [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

---
type: Eval Scenario
title: ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_...
description: "ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed."
source_id: "component-obsolescence-risk-monitor-effectivity-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed.

## Validates

- [eol-signal-bom-correlation](/queries/eol-signal-bom-correlation.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Component Obsolescence Risk Monitor Standard Operating Procedure](/documents/component-obsolescence-risk-monitor-sop.md)

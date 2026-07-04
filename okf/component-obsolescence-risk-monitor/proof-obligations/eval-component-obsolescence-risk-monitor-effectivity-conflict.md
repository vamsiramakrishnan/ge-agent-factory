---
type: Proof Obligation
title: "Golden eval obligation — ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed."
description: golden eval proof obligation
source_id: "eval-component-obsolescence-risk-monitor-effectivity-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [component-obsolescence-risk-monitor-effectivity-conflict](/tests/component-obsolescence-risk-monitor-effectivity-conflict.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

## Entities that must be referenced

- engineering_change_orders
- bom_revisions
- purchase_orders

## Forbidden behaviors

- does not invoke action_ptc_windchill_plm_recommend before the effectivity conflict is resolved
- does not fabricate a last-time-buy quantity without querying purchase_orders and remaining-demand evidence

# Citations

- [component-obsolescence-risk-monitor-sop](/documents/component-obsolescence-risk-monitor-sop.md)

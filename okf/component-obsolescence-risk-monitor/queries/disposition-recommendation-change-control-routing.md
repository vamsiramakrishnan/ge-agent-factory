---
type: Query Capability
title: "Recommend last-time buy, alternate qualification, or redesign per part and, f..."
description: "Recommend last-time buy, alternate qualification, or redesign per part and, for Class 1 (form/fit/function) changes flagged on engineering_change_orders, route through the engineering change control board before calling action_ptc_windchill_plm_recommend."
source_id: "disposition-recommendation-change-control-routing"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recommend last-time buy, alternate qualification, or redesign per part and, for Class 1 (form/fit/function) changes flagged on engineering_change_orders, route through the engineering change control board before calling action_ptc_windchill_plm_recommend.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

## Runs in

- [disposition_recommendation_change_control_routing](/workflow/disposition-recommendation-change-control-routing.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Component Obsolescence Risk Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/component-obsolescence-risk-monitor-end-to-end.md)
- [ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed.](/tests/component-obsolescence-risk-monitor-effectivity-conflict.md)
- [Engineering change order ECO 24583 (class_1_form_fit_function, supplier_obsolescence, affected_item_count 214) is at risk. The most recent BigQuery analytics_events refresh for remaining-demand metrics is timestamped 2026-07-02 14:00 (38 hours old) and the affected part's vendor carries risk_score 'high'. Recommend whether to issue a last-time-buy order for 5,000 units before the supplier's EOL cutoff on 2026-07-06.](/tests/component-obsolescence-risk-monitor-stale-evidence-threshold.md)

# Citations

- [Component Obsolescence Risk Monitor Standard Operating Procedure](/documents/component-obsolescence-risk-monitor-sop.md)
- [Export Control Classification & ITAR/EAR Technical Data Handling Policy](/documents/export-control-technical-data-handling-policy.md)

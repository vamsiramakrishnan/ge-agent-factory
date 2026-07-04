---
type: Agent Tool
title: query_ptc_windchill_plm_engineering_change_orders
description: Retrieve engineering change orders from PTC Windchill PLM for the Component Obsolescence Risk Monitor workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ptc_windchill_plm_engineering_change_orders

Retrieve engineering change orders from PTC Windchill PLM for the Component Obsolescence Risk Monitor workflow.

- **Kind:** query
- **Source system:** [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

## Inputs

- eco_number
- date_range

## Outputs

- engineering_change_orders_records
- engineering_change_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PTC Windchill PLM](/systems/ptc-windchill-plm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [eol_signal_bom_correlation](/workflow/eol-signal-bom-correlation.md)
- [disposition_recommendation_change_control_routing](/workflow/disposition-recommendation-change-control-routing.md)
- [action_execution_audit_trail_escalation](/workflow/action-execution-audit-trail-escalation.md)

## Evals

- [Run the Component Obsolescence Risk Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/component-obsolescence-risk-monitor-end-to-end.md)
- [ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed.](/tests/component-obsolescence-risk-monitor-effectivity-conflict.md)
- [Engineering change order ECO 24583 (class_1_form_fit_function, supplier_obsolescence, affected_item_count 214) is at risk. The most recent BigQuery analytics_events refresh for remaining-demand metrics is timestamped 2026-07-02 14:00 (38 hours old) and the affected part's vendor carries risk_score 'high'. Recommend whether to issue a last-time-buy order for 5,000 units before the supplier's EOL cutoff on 2026-07-06.](/tests/component-obsolescence-risk-monitor-stale-evidence-threshold.md)

## Evidence emitted

- source_system_record

## Required inputs

- eco_number
- date_range

## Produces

- engineering_change_orders_records
- engineering_change_orders_summary

# Examples

```
query_ptc_windchill_plm_engineering_change_orders(eco_number=<eco_number>, date_range=<date_range>)
```

# Citations

- [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

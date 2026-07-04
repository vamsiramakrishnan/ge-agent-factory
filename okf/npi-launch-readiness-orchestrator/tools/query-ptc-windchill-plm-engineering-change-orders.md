---
type: Agent Tool
title: query_ptc_windchill_plm_engineering_change_orders
description: Retrieve engineering change orders from PTC Windchill PLM for the NPI Launch Readiness Orchestrator workflow.
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

Retrieve engineering change orders from PTC Windchill PLM for the NPI Launch Readiness Orchestrator workflow.

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

- [gate_deliverable_reconciliation](/workflow/gate-deliverable-reconciliation.md)
- [change_class_export_control_gate_check](/workflow/change-class-export-control-gate-check.md)
- [critical_path_escalation](/workflow/critical-path-escalation.md)
- [gate_review_readiness_pack_compilation](/workflow/gate-review-readiness-pack-compilation.md)

## Evals

- [Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/npi-launch-readiness-orchestrator-end-to-end.md)
- [Gate review for Program Falcon-7 is in 9 days. Jira issue NPI-4821 (linked to ECO-24417, owner Priya Raghunathan) shows status 'closed' with a note that the drawing package is done. But PTC Windchill CAD document 8341206 rev C tied to that ECO still shows lifecycle_state 'in_review' and checked_out=true as of this morning. The program office wants this deliverable marked green in tomorrow's readiness pack. Should it be?](/tests/npi-launch-readiness-orchestrator-status-mismatch-gate.md)
- [Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?](/tests/npi-launch-readiness-orchestrator-recovery-runway-escalation.md)

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

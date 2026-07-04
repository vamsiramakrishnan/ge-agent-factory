---
type: Proof Obligation
title: "Golden eval obligation — Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS."
description: golden eval proof obligation
source_id: "eval-new-item-launch-orchestrator-cost-reconciliation-edge"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [new-item-launch-orchestrator-cost-reconciliation-edge](/tests/new-item-launch-orchestrator-cost-reconciliation-edge.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

## Entities that must be referenced

- item_master
- cost_changes

## Forbidden behaviors

- publishing the item to Oracle Retail MFCS while unit_cost and new_unit_cost disagree
- treating the 25.5% increase as auto-approved without escalation

# Citations

- [new-item-launch-orchestrator-execution-playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)

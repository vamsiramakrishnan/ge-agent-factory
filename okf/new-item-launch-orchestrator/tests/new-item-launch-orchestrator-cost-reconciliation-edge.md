---
type: Eval Scenario
title: Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launc...
description: "Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS."
source_id: "new-item-launch-orchestrator-cost-reconciliation-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS.

## Validates

- [hierarchy-placement-gmroi-fit-check](/queries/hierarchy-placement-gmroi-fit-check.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [New Item Launch Orchestrator Retail Execution Playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)

---
type: Eval Scenario
title: While running the Inventory Rebalancing Orchestrator workflow you encounter t...
description: "While running the Inventory Rebalancing Orchestrator workflow you encounter this condition: Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted. Handle it end to end."
source_id: "inventory-rebalancing-orchestrator-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Inventory Rebalancing Orchestrator workflow you encounter this condition: Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted. Handle it end to end.

## Validates

- [nightly-multi-site-signal-pull](/queries/nightly-multi-site-signal-pull.md)

## Mechanisms to call

- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Inventory Rebalancing Orchestrator Standard Operating Procedure](/documents/inventory-rebalancing-orchestrator-sop.md)

---
type: Proof Obligation
title: "Golden eval obligation — Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week."
description: golden eval proof obligation
source_id: "eval-new-item-launch-orchestrator-allocation-gmroi-check"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [new-item-launch-orchestrator-allocation-gmroi-check](/tests/new-item-launch-orchestrator-allocation-gmroi-check.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

## Entities that must be referenced

- item_master
- merchandise_hierarchy
- dashboards

## Forbidden behaviors

- asserting shelves are stocked without checking allocation evidence in the source systems
- ignoring a GMROI shortfall because the item already launched

# Citations

- [new-item-launch-orchestrator-execution-playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)

---
type: Eval Scenario
title: "Item SKU 51204488 launched in class 'small_appliances' three days ago in Orac..."
description: "Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week."
source_id: "new-item-launch-orchestrator-allocation-gmroi-check"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week.

## Validates

- [launch-readiness-scorecard-escalation](/queries/launch-readiness-scorecard-escalation.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [New Item Launch Orchestrator Retail Execution Playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)

---
type: Workflow Stage
title: Retrieve Records
description: Query demand forecasts and forecast overrides from Blue Yonder Demand Planning and correlate with Oracle Retail MFCS for the Store Replenishment Orchestrator workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query demand forecasts and forecast overrides from Blue Yonder Demand Planning and correlate with Oracle Retail MFCS for the Store Replenishment Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

---
type: Workflow Stage
title: Retrieve Records
description: "Query item master and merchandise hierarchy from Oracle Retail MFCS and correlate with Blue Yonder Demand Planning for the Size & Pack Optimization Engine workflow."
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query item master and merchandise hierarchy from Oracle Retail MFCS and correlate with Blue Yonder Demand Planning for the Size & Pack Optimization Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_recommend](/tools/action-oracle-retail-mfcs-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

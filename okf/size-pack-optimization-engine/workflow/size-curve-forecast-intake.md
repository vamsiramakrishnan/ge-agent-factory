---
type: Workflow Stage
title: "Size-Curve & Forecast Intake"
description: "Pull item_master, merchandise_hierarchy, and case_pack data from Oracle Retail MFCS and cross-reference demand_forecasts and seasonal_profiles from Blue Yonder Demand Planning for the SKU-class-store combinations entering the buy window."
source_id: size_curve_forecast_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Size-Curve & Forecast Intake

Pull item_master, merchandise_hierarchy, and case_pack data from Oracle Retail MFCS and cross-reference demand_forecasts and seasonal_profiles from Blue Yonder Demand Planning for the SKU-class-store combinations entering the buy window.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_recommend](/tools/action-oracle-retail-mfcs-recommend.md)

Next: [Store-Cluster Curve Fitting](/workflow/store-cluster-curve-fitting.md)

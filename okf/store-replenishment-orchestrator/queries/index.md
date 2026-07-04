---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull demand_forecasts, forecast_overrides, and seasonal_profiles from Blue Yonder Demand Planning to establish the current statistical baseline and any planner-approved overrides for the week.](/queries/forecast-override-intake.md)
- [Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracle Retail MFCS to confirm case_pack, item_status, and presentation-minimum constraints before touching any parameter.](/queries/item-presentation-cross-reference.md)
- [Query analytics_events, historical_metrics, and cached_aggregates in BigQuery to score out-of-stock and weeks-of-supply variance by store-SKU and prioritize the Allocation Analyst's exception queue.](/queries/sell-through-variance-scoring.md)
- [Use lookup_store_replenishment_orchestrator_execution_playbook to cite the governing sections of the Store Replenishment Orchestrator Retail Execution Playbook and the Presentation Minimums & Case-Pack Rounding Rate Manual before any parameter recommendation is finalized.](/queries/playbook-rate-manual-gate.md)
- [Execute action_oracle_retail_mfcs_approve to write approved item-store parameter changes back into Blue Yonder Demand Planning, emit an audit_record_id, and escalate exceptions to the Allocation Analyst or replenishment_manager.](/queries/parameter-push-audit.md)

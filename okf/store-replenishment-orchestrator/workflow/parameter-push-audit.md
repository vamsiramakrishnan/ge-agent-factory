---
type: Workflow Stage
title: "Parameter Push & Audit"
description: "Execute action_oracle_retail_mfcs_approve to write approved item-store parameter changes back into Blue Yonder Demand Planning, emit an audit_record_id, and escalate exceptions to the Allocation Analyst or replenishment_manager."
source_id: parameter_push_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Parameter Push & Audit

Execute action_oracle_retail_mfcs_approve to write approved item-store parameter changes back into Blue Yonder Demand Planning, emit an audit_record_id, and escalate exceptions to the Allocation Analyst or replenishment_manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

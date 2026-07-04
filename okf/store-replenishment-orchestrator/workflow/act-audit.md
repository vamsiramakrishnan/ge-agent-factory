---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the approve step in Blue Yonder Demand Planning with a full audit trail, and escalate exceptions to the Allocation Analyst."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the approve step in Blue Yonder Demand Planning with a full audit trail, and escalate exceptions to the Allocation Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

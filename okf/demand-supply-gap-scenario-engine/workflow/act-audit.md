---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the S&OP Manager."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the S&OP Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)
- [action_kinaxis_rapidresponse_publish](/tools/action-kinaxis-rapidresponse-publish.md)

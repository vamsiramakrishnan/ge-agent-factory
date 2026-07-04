---
type: Workflow Stage
title: "SOP & Rate-Schedule Evidence Gating"
description: "Calls lookup_demand_supply_gap_scenario_engine_sop and cites the Customer Service-Level Commitment & ATP/CTP Rate Schedule to validate solver_status, check service_level_pct against the contractual floor, and confirm supply_plans freshness before any recommendation is drafted."
source_id: sop_rate_schedule_evidence_gating
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Rate-Schedule Evidence Gating

Calls lookup_demand_supply_gap_scenario_engine_sop and cites the Customer Service-Level Commitment & ATP/CTP Rate Schedule to validate solver_status, check service_level_pct against the contractual floor, and confirm supply_plans freshness before any recommendation is drafted.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)

Next: [Executive Briefing Publish & Escalation](/workflow/executive-briefing-publish-escalation.md)

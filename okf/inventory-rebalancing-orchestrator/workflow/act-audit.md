---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Inventory Analyst."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Inventory Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

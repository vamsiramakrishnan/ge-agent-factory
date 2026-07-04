---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the draft step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Supply Planner."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the draft step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Supply Planner.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)
- [action_sap_s_4hana_mm_draft](/tools/action-sap-s-4hana-mm-draft.md)

---
type: Workflow Stage
title: SOP and policy evidence gate
description: "Cite the BOM PLM-ERP Sync Monitor SOP and the CCB Effectivity & BOM Cut-In Policy via lookup_bom_plm_erp_sync_monitor_sop before any fix or disposition is recommended to the PLM Administrator."
source_id: sop_and_policy_evidence_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP and policy evidence gate

Cite the BOM PLM-ERP Sync Monitor SOP and the CCB Effectivity & BOM Cut-In Policy via lookup_bom_plm_erp_sync_monitor_sop before any fix or disposition is recommended to the PLM Administrator.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [Escalate & audit in Windchill](/workflow/escalate-audit-in-windchill.md)

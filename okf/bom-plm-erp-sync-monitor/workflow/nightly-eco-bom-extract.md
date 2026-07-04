---
type: Workflow Stage
title: "Nightly ECO & BOM extract"
description: "Pull released engineering_change_orders, bom_revisions, and cad_document_records from PTC Windchill PLM's overnight change queue for every material touched since the last successful sync."
source_id: nightly_eco_bom_extract
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly ECO & BOM extract

Pull released engineering_change_orders, bom_revisions, and cad_document_records from PTC Windchill PLM's overnight change queue for every material touched since the last successful sync.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [ERP BOM correlation](/workflow/erp-bom-correlation.md)

---
type: Eval Scenario
title: "Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the re..."
description: "Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "bom-plm-erp-sync-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Success rubric

Action escalate executed against PTC Windchill PLM, with audit-trail entry and PLM Administrator notified of outcomes.

# Citations

- [BOM PLM-ERP Sync Monitor Standard Operating Procedure](/documents/bom-plm-erp-sync-monitor-sop.md)

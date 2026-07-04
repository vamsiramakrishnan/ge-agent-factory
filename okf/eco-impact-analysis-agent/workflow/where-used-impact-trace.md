---
type: Workflow Stage
title: "Where-Used Impact Trace"
description: Walk bom_revisions and cad_document_records in PTC Windchill PLM via query_ptc_windchill_plm_bom_revisions and query_ptc_windchill_plm_cad_document_records to enumerate every affected parent assembly and released document tied to the ECO.
source_id: where_used_impact_trace
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Where-Used Impact Trace

Walk bom_revisions and cad_document_records in PTC Windchill PLM via query_ptc_windchill_plm_bom_revisions and query_ptc_windchill_plm_cad_document_records to enumerate every affected parent assembly and released document tied to the ECO.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [SAP Production & Inventory Cross-Reference](/workflow/sap-production-inventory-cross-reference.md)

---
type: Workflow Stage
title: Retrieve Records
description: Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

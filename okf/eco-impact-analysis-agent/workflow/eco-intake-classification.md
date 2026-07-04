---
type: Workflow Stage
title: "ECO Intake & Classification"
description: "Pull the triggering record via query_ptc_windchill_plm_engineering_change_orders from PTC Windchill PLM and classify it by change_class, change_reason, and effectivity_type before scoping the impact trace."
source_id: eco_intake_classification
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ECO Intake & Classification

Pull the triggering record via query_ptc_windchill_plm_engineering_change_orders from PTC Windchill PLM and classify it by change_class, change_reason, and effectivity_type before scoping the impact trace.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [Where-Used Impact Trace](/workflow/where-used-impact-trace.md)

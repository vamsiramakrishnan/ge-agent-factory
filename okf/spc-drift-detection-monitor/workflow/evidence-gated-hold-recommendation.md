---
type: Workflow Stage
title: "Evidence-Gated Hold Recommendation"
description: "Cite the SPC Drift Detection Monitor Standard Operating Procedure and the CTQ control plan via lookup_spc_drift_detection_monitor_sop, then invoke action_sap_s_4hana_qm_recommend to propose a hold or disposition on the affected inspection_lots only when at least two source systems corroborate the drift."
source_id: evidence_gated_hold_recommendation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence-Gated Hold Recommendation

Cite the SPC Drift Detection Monitor Standard Operating Procedure and the CTQ control plan via lookup_spc_drift_detection_monitor_sop, then invoke action_sap_s_4hana_qm_recommend to propose a hold or disposition on the affected inspection_lots only when at least two source systems corroborate the drift.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

---
type: Workflow Stage
title: CAPA Notification Intake
description: "Detect a qualifying nonconformance_records entry against a lot in SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots), open a structured capa_actions workspace, and draft the initial problem statement from the defect_code and severity classification."
source_id: capa_notification_intake
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# CAPA Notification Intake

Detect a qualifying nonconformance_records entry against a lot in SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots), open a structured capa_actions workspace, and draft the initial problem statement from the defect_code and severity classification.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

Next: [Historical Precedent Matching](/workflow/historical-precedent-matching.md)

---
type: Workflow Stage
title: "Effectiveness Verification & Reopen Gate"
description: "Re-query nonconformance_records defect rates for the affected characteristic after a capa_actions record moves to effectiveness_check, and reopen the CAPA (status back to root_cause_analysis) via action_sap_s_4hana_qm_escalate if the failure mode recurs."
source_id: effectiveness_verification_reopen_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Effectiveness Verification & Reopen Gate

Re-query nonconformance_records defect rates for the affected characteristic after a capa_actions record moves to effectiveness_check, and reopen the CAPA (status back to root_cause_analysis) via action_sap_s_4hana_qm_escalate if the failure mode recurs.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

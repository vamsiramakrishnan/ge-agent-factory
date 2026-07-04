---
type: Workflow Stage
title: "Routing, Escalation & Audit"
description: "Route the disposition recommendation to its owner or execute action_sap_s_4hana_qm_escalate in SAP S/4HANA QM with a full audit trail, notifying the Shift Quality Lead, quality_engineer, or quality_manager per the escalation gates."
source_id: routing_escalation_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Routing, Escalation & Audit

Route the disposition recommendation to its owner or execute action_sap_s_4hana_qm_escalate in SAP S/4HANA QM with a full audit trail, notifying the Shift Quality Lead, quality_engineer, or quality_manager per the escalation gates.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

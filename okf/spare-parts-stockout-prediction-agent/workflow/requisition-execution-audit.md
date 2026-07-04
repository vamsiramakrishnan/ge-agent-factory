---
type: Workflow Stage
title: "Requisition Execution & Audit"
description: "Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trail for the approved requisition, and escalate any expedite or high-risk-vendor exceptions to the MRO Storeroom Manager."
source_id: requisition_execution_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Requisition Execution & Audit

Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trail for the approved requisition, and escalate any expedite or high-risk-vendor exceptions to the MRO Storeroom Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

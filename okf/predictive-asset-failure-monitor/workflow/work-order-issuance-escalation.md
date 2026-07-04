---
type: Workflow Stage
title: "Work Order Issuance & Escalation"
description: "Execute action_ibm_maximo_recommend to raise a prioritized condition-based maintenance_work_orders record in IBM Maximo, or hand off to the Reliability Engineer when an escalation rule fires."
source_id: work_order_issuance_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work Order Issuance & Escalation

Execute action_ibm_maximo_recommend to raise a prioritized condition-based maintenance_work_orders record in IBM Maximo, or hand off to the Reliability Engineer when an escalation rule fires.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

---
type: Workflow Stage
title: "Escalate Stalled Permits & Audit"
description: "Execute action_oracle_field_service_escalate for stalled or rejected permits tied to field_work_orders, attach the full audit trail, and hand off to the Construction Program Manager or named specialist per the escalation matrix."
source_id: escalate_stalled_permits_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalate Stalled Permits & Audit

Execute action_oracle_field_service_escalate for stalled or rejected permits tied to field_work_orders, attach the full audit trail, and hand off to the Construction Program Manager or named specialist per the escalation matrix.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

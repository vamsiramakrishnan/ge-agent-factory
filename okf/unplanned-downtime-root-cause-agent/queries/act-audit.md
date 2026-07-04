---
type: Query Capability
title: "Execute the escalate step in Siemens Opcenter MES with a full audit trail, an..."
description: "Execute the escalate step in Siemens Opcenter MES with a full audit trail, and escalate exceptions to the Plant Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Siemens Opcenter MES with a full audit trail, and escalate exceptions to the Plant Manager.

## Tools used

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/unplanned-downtime-root-cause-agent-end-to-end.md)

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)

---
type: Query Capability
title: "Execute the escalate step in PTC Windchill PLM with a full audit trail, and e..."
description: "Execute the escalate step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the PLM Administrator."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the PLM Administrator.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bom-plm-erp-sync-monitor-end-to-end.md)

# Citations

- [BOM PLM-ERP Sync Monitor Standard Operating Procedure](/documents/bom-plm-erp-sync-monitor-sop.md)

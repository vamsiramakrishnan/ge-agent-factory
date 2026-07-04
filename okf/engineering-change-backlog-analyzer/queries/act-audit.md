---
type: Query Capability
title: "Execute the draft step in PTC Windchill PLM with a full audit trail, and esca..."
description: "Execute the draft step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the Design Engineer."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the draft step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the Design Engineer.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engineering-change-backlog-analyzer-end-to-end.md)

# Citations

- [Engineering Change Backlog Analyzer Standard Operating Procedure](/documents/engineering-change-backlog-analyzer-sop.md)

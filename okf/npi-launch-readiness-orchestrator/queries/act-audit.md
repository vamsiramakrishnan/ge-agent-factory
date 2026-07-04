---
type: Query Capability
title: "Execute the escalate step in PTC Windchill PLM with a full audit trail, and e..."
description: "Execute the escalate step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the NPI Program Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the NPI Program Manager.

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

- [Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/npi-launch-readiness-orchestrator-end-to-end.md)

# Citations

- [NPI Launch Readiness Orchestrator Standard Operating Procedure](/documents/npi-launch-readiness-orchestrator-sop.md)

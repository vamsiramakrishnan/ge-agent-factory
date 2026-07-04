---
type: Query Capability
title: "Execute the publish step in IBM Maximo with a full audit trail, and escalate ..."
description: "Execute the publish step in IBM Maximo with a full audit trail, and escalate exceptions to the Reliability Engineer."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in IBM Maximo with a full audit trail, and escalate exceptions to the Reliability Engineer.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bad-actor-asset-analyzer-end-to-end.md)

# Citations

- [Bad Actor Asset Analyzer Standard Operating Procedure](/documents/bad-actor-asset-analyzer-sop.md)

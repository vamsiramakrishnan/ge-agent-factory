---
type: Query Capability
title: "Execute the recommend step in IBM Maximo with a full audit trail, and escalat..."
description: "Execute the recommend step in IBM Maximo with a full audit trail, and escalate exceptions to the MRO Storeroom Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in IBM Maximo with a full audit trail, and escalate exceptions to the MRO Storeroom Manager.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spare-parts-stockout-prediction-agent-end-to-end.md)

# Citations

- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)

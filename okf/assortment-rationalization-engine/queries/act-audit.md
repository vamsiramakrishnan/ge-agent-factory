---
type: Query Capability
title: "Execute the route step in Oracle Retail MFCS with a full audit trail, and esc..."
description: "Execute the route step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Category Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Category Manager.

## Tools used

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/assortment-rationalization-engine-end-to-end.md)

# Citations

- [Assortment Rationalization Engine Retail Execution Playbook](/documents/assortment-rationalization-engine-execution-playbook.md)

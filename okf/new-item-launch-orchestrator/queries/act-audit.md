---
type: Query Capability
title: "Execute the publish step in Oracle Retail MFCS with a full audit trail, and e..."
description: "Execute the publish step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Category Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Category Manager.

## Tools used

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-item-launch-orchestrator-end-to-end.md)

# Citations

- [New Item Launch Orchestrator Retail Execution Playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)

---
type: Query Capability
title: "Update the architecture model in Ardoq with discovered dependencies, CMDB rec..."
description: "Update the architecture model in Ardoq with discovered dependencies, CMDB reconciliation, and risk annotations."
source_id: "model-update"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Update the architecture model in Ardoq with discovered dependencies, CMDB reconciliation, and risk annotations.

## Tools used

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [action_servicenow_cmdb_recommend](/tools/action-servicenow-cmdb-recommend.md)

## Runs in

- [model_update](/workflow/model-update.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

# Citations

- [System Dependency Mapper Operations Runbook](/documents/system-dependency-mapper-runbook.md)

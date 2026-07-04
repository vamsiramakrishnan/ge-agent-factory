---
type: Query Capability
title: Aggregate device inventory from ManageEngine and Google Workspace Admin. Enri...
description: "Aggregate device inventory from ManageEngine and Google Workspace Admin. Enrich with warranty status, hardware specs, OS version, and user department mapping."
source_id: "device-census"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate device inventory from ManageEngine and Google Workspace Admin. Enrich with warranty status, hardware specs, OS version, and user department mapping.

## Tools used

- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)
- [action_manageengine_generate](/tools/action-manageengine-generate.md)

## Runs in

- [device_census](/workflow/device-census.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/device-lifecycle-manager-end-to-end.md)

# Citations

- [Device Lifecycle Manager Operations Runbook](/documents/device-lifecycle-manager-runbook.md)

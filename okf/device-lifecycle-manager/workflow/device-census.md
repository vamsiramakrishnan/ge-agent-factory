---
type: Workflow Stage
title: Device Census
description: "Aggregate device inventory from ManageEngine and Google Workspace Admin. Enrich with warranty status, hardware specs, OS version, and user department mapping."
source_id: device_census
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Device Census

Aggregate device inventory from ManageEngine and Google Workspace Admin. Enrich with warranty status, hardware specs, OS version, and user department mapping.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)
- [action_manageengine_generate](/tools/action-manageengine-generate.md)

Next: [Failure Risk Modeling](/workflow/failure-risk-modeling.md)

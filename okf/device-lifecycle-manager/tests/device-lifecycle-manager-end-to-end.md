---
type: Eval Scenario
title: Run the Device Lifecycle Manager workflow for the current period. Cite the re...
description: "Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "device-lifecycle-manager-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [device-census](/queries/device-census.md)

## Mechanisms to call

- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)
- [action_manageengine_generate](/tools/action-manageengine-generate.md)

## Success rubric

Action generate executed against ManageEngine, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Device Lifecycle Manager Operations Runbook](/documents/device-lifecycle-manager-runbook.md)

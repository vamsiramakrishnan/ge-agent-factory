---
type: Query Capability
title: Monitor authentication events from Okta and Google Workspace. Track login loc...
description: "Monitor authentication events from Okta and Google Workspace. Track login locations, times, devices, privilege escalations, and dormant account reactivation."
source_id: "identity-event-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor authentication events from Okta and Google Workspace. Track login locations, times, devices, privilege escalations, and dormant account reactivation.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

## Runs in

- [identity_event_collection](/workflow/identity-event-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/identity-access-anomaly-detector-end-to-end.md)

# Citations

- [Identity & Access Anomaly Detector Operations Runbook](/documents/identity-access-anomaly-detector-runbook.md)

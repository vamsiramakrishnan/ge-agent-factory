---
type: Workflow Stage
title: Identity Event Collection
description: "Monitor authentication events from Okta and Google Workspace. Track login locations, times, devices, privilege escalations, and dormant account reactivation."
source_id: identity_event_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identity Event Collection

Monitor authentication events from Okta and Google Workspace. Track login locations, times, devices, privilege escalations, and dormant account reactivation.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

Next: [Behavioral Baseline & Anomaly Detection](/workflow/behavioral-baseline-anomaly-detection.md)

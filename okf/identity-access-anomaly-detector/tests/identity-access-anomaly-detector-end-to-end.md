---
type: Eval Scenario
title: "Run the Identity & Access Anomaly Detector workflow for the current period. C..."
description: "Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "identity-access-anomaly-detector-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [identity-event-collection](/queries/identity-event-collection.md)

## Mechanisms to call

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

## Success rubric

CISO / Security Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Identity & Access Anomaly Detector Operations Runbook](/documents/identity-access-anomaly-detector-runbook.md)

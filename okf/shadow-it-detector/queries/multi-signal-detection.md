---
type: Query Capability
title: "Detect unsanctioned apps from multiple signals: OAuth grants in Google Worksp..."
description: "Detect unsanctioned apps from multiple signals: OAuth grants in Google Workspace and Okta, network traffic to unknown SaaS in Palo Alto, unapproved browser extensions in CrowdStrike."
source_id: "multi-signal-detection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect unsanctioned apps from multiple signals: OAuth grants in Google Workspace and Okta, network traffic to unknown SaaS in Palo Alto, unapproved browser extensions in CrowdStrike.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [action_okta_approve](/tools/action-okta-approve.md)

## Runs in

- [multi_signal_detection](/workflow/multi-signal-detection.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

# Citations

- [Shadow IT Detector Operations Runbook](/documents/shadow-it-detector-runbook.md)

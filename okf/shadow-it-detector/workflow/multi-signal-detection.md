---
type: Workflow Stage
title: "Multi-Signal Detection"
description: "Detect unsanctioned apps from multiple signals: OAuth grants in Google Workspace and Okta, network traffic to unknown SaaS in Palo Alto, unapproved browser extensions in CrowdStrike."
source_id: multi_signal_detection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Signal Detection

Detect unsanctioned apps from multiple signals: OAuth grants in Google Workspace and Okta, network traffic to unknown SaaS in Palo Alto, unapproved browser extensions in CrowdStrike.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [action_okta_approve](/tools/action-okta-approve.md)

Next: [Risk Scoring](/workflow/risk-scoring.md)

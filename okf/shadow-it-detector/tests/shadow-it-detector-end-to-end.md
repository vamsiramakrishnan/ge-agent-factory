---
type: Eval Scenario
title: Run the Shadow IT Detector workflow for the current period. Cite the relevant...
description: "Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "shadow-it-detector-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-signal-detection](/queries/multi-signal-detection.md)

## Mechanisms to call

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [lookup_shadow_it_detector_runbook](/tools/lookup-shadow-it-detector-runbook.md)
- [action_okta_approve](/tools/action-okta-approve.md)

## Success rubric

Action approve executed against Okta, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Shadow IT Detector Operations Runbook](/documents/shadow-it-detector-runbook.md)

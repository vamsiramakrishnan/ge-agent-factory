---
type: Eval Scenario
title: "Run the Phishing & Email Threat Analyzer workflow for the current period. Cit..."
description: "Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "phishing-email-threat-analyzer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [threat-intelligence-matching](/queries/threat-intelligence-matching.md)

## Mechanisms to call

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

## Success rubric

Action match executed against Google Workspace, with audit-trail entry and Security Analyst notified of outcomes.

# Citations

- [Phishing & Email Threat Analyzer Operations Runbook](/documents/phishing-email-threat-analyzer-runbook.md)

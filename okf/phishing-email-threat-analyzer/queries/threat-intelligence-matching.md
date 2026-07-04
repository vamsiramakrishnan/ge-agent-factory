---
type: Query Capability
title: "Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious att..."
description: "Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization."
source_id: "threat-intelligence-matching"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization.

## Tools used

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

## Runs in

- [threat_intelligence_matching](/workflow/threat-intelligence-matching.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/phishing-email-threat-analyzer-end-to-end.md)

# Citations

- [Phishing & Email Threat Analyzer Operations Runbook](/documents/phishing-email-threat-analyzer-runbook.md)

---
type: Workflow Stage
title: Threat Intelligence Matching
description: "Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization."
source_id: threat_intelligence_matching
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Threat Intelligence Matching

Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

Next: [Sophisticated Phishing Detection](/workflow/sophisticated-phishing-detection.md)

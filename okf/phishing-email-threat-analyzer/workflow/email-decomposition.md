---
type: Workflow Stage
title: Email Decomposition
description: "Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text."
source_id: email_decomposition
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Email Decomposition

Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

Next: [Threat Intelligence Matching](/workflow/threat-intelligence-matching.md)

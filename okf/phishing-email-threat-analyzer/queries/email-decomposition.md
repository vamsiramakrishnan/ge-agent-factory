---
type: Query Capability
title: "Extract all IOCs from reported email: sender domain, reply-to mismatches, emb..."
description: "Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text."
source_id: "email-decomposition"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text.

## Tools used

- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

## Runs in

- [email_decomposition](/workflow/email-decomposition.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/phishing-email-threat-analyzer-end-to-end.md)

# Citations

- [Phishing & Email Threat Analyzer Operations Runbook](/documents/phishing-email-threat-analyzer-runbook.md)

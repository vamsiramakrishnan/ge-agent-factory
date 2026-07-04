---
type: Query Capability
title: "Confirmed phishing emails quarantined org-wide. Sender domain blocked. IOCs a..."
description: "Confirmed phishing emails quarantined org-wide. Sender domain blocked. IOCs added to threat intelligence database for future detection."
source_id: "quarantine-response"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confirmed phishing emails quarantined org-wide. Sender domain blocked. IOCs added to threat intelligence database for future detection.

## Tools used

- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)

## Runs in

- [quarantine_response](/workflow/quarantine-response.md)

## Evidence expected

- document_reference

## Evals

- [Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/phishing-email-threat-analyzer-end-to-end.md)

# Citations

- [Phishing & Email Threat Analyzer Operations Runbook](/documents/phishing-email-threat-analyzer-runbook.md)

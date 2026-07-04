---
type: Query Capability
title: Parse corporate policy documents to extract quantitative rules — spending lim...
description: "Parse corporate policy documents to extract quantitative rules — spending limits, approval thresholds, required documentation — into machine-readable format."
source_id: "policy-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse corporate policy documents to extract quantitative rules — spending limits, approval thresholds, required documentation — into machine-readable format.

## Tools used

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

## Runs in

- [policy_extraction](/workflow/policy-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-compliance-scanner-end-to-end.md)

# Citations

- [Policy Compliance Scanner Controls Playbook](/documents/policy-compliance-scanner-controls-playbook.md)

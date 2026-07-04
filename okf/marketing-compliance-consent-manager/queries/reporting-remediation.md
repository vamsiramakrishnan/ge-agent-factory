---
type: Query Capability
title: Generate compliance reports for Marketing Ops Lead and Legal review. Track re...
description: Generate compliance reports for Marketing Ops Lead and Legal review. Track remediation progress. Automate consent sync fixes where possible.
source_id: "reporting-remediation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate compliance reports for Marketing Ops Lead and Legal review. Track remediation progress. Automate consent sync fixes where possible.

## Tools used

- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

## Runs in

- [reporting_remediation](/workflow/reporting-remediation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-compliance-consent-manager-end-to-end.md)

# Citations

- [Marketing Compliance & Consent Manager Playbook](/documents/marketing-compliance-consent-manager-playbook.md)

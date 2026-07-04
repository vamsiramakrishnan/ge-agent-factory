---
type: Query Capability
title: "Generate compliance report with trend analysis, department-level scores, and ..."
description: "Generate compliance report with trend analysis, department-level scores, and recommended enforcement actions."
source_id: "report-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate compliance report with trend analysis, department-level scores, and recommended enforcement actions.

## Tools used

- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

## Runs in

- [report_generation](/workflow/report-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-compliance-scanner-end-to-end.md)

# Citations

- [Policy Compliance Scanner Controls Playbook](/documents/policy-compliance-scanner-controls-playbook.md)

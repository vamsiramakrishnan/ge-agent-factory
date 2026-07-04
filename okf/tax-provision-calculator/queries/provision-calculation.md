---
type: Query Capability
title: Calculate current and deferred tax provisions across all jurisdictions. Compu...
description: "Calculate current and deferred tax provisions across all jurisdictions. Compute DTA/DTL movements, valuation allowance assessments, and rate reconciliation. Generate ASC 740 workpapers."
source_id: "provision-calculation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate current and deferred tax provisions across all jurisdictions. Compute DTA/DTL movements, valuation allowance assessments, and rate reconciliation. Generate ASC 740 workpapers.

## Tools used

- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [provision_calculation](/workflow/provision-calculation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-provision-calculator-end-to-end.md)

# Citations

- [Tax Provision Calculator Controls Playbook](/documents/tax-provision-calculator-controls-playbook.md)

---
type: Query Capability
title: "Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain pro..."
description: "Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain product line -- book at 75% probability ($600K) per ASC 740-10. Disclose the uncertain position.' Generates probability-weighted provision adjustments."
source_id: "uncertain-tax-position-analysis"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain product line -- book at 75% probability ($600K) per ASC 740-10. Disclose the uncertain position.' Generates probability-weighted provision adjustments.

## Tools used

- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [uncertain_tax_position_analysis](/workflow/uncertain-tax-position-analysis.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-provision-calculator-end-to-end.md)

# Citations

- [Tax Provision Calculator Controls Playbook](/documents/tax-provision-calculator-controls-playbook.md)

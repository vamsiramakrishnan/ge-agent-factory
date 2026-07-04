---
type: Workflow Stage
title: Provision Calculation
description: "Calculate current and deferred tax provisions across all jurisdictions. Compute DTA/DTL movements, valuation allowance assessments, and rate reconciliation. Generate ASC 740 workpapers."
source_id: provision_calculation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Provision Calculation

Calculate current and deferred tax provisions across all jurisdictions. Compute DTA/DTL movements, valuation allowance assessments, and rate reconciliation. Generate ASC 740 workpapers.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [Uncertain Tax Position Analysis](/workflow/uncertain-tax-position-analysis.md)

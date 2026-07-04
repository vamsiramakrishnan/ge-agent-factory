---
type: Workflow Stage
title: Uncertain Tax Position Analysis
description: "Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain product line -- book at 75% probability ($600K) per ASC 740-10. Disclose the uncertain position.' Generates probability-weighted provision adjustments."
source_id: uncertain_tax_position_analysis
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Uncertain Tax Position Analysis

Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain product line -- book at 75% probability ($600K) per ASC 740-10. Disclose the uncertain position.' Generates probability-weighted provision adjustments.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [Approval & Reporting](/workflow/approval-reporting.md)

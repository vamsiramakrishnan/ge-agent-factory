---
type: Workflow Stage
title: Trial Balance Processing
description: "Extract trial balance from SAP FI. Apply financial statement mapping rules to classify GL accounts into income statement, balance sheet, and cash flow categories."
source_id: trial_balance_processing
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Trial Balance Processing

Extract trial balance from SAP FI. Apply financial statement mapping rules to classify GL accounts into income statement, balance sheet, and cash flow categories.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_financial_statement_generator_controls_playbook](/tools/lookup-financial-statement-generator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [Statement Calculation](/workflow/statement-calculation.md)

---
type: Workflow Stage
title: Complex Account Validation
description: "For complex reconciliations (prepaid expenses, accrued liabilities), Gemini reads supporting contracts and invoices to validate balances and generate catch-up entries for missed amortization."
source_id: complex_account_validation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Complex Account Validation

For complex reconciliations (prepaid expenses, accrued liabilities), Gemini reads supporting contracts and invoices to validate balances and generate catch-up entries for missed amortization.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)

Next: [Workpaper Generation](/workflow/workpaper-generation.md)

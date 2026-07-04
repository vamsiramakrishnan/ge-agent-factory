---
type: Query Capability
title: "For complex reconciliations (prepaid expenses, accrued liabilities), Gemini r..."
description: "For complex reconciliations (prepaid expenses, accrued liabilities), Gemini reads supporting contracts and invoices to validate balances and generate catch-up entries for missed amortization."
source_id: "complex-account-validation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# For complex reconciliations (prepaid expenses, accrued liabilities), Gemini reads supporting contracts and invoices to validate balances and generate catch-up entries for missed amortization.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)

## Runs in

- [complex_account_validation](/workflow/complex-account-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-reconciliation-agent-end-to-end.md)

# Citations

- [Account Reconciliation Agent Controls Playbook](/documents/account-reconciliation-agent-controls-playbook.md)

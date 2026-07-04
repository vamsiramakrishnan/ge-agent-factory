---
type: Query Capability
title: Extract trial balance from SAP FI. Apply financial statement mapping rules to...
description: "Extract trial balance from SAP FI. Apply financial statement mapping rules to classify GL accounts into income statement, balance sheet, and cash flow categories."
source_id: "trial-balance-processing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract trial balance from SAP FI. Apply financial statement mapping rules to classify GL accounts into income statement, balance sheet, and cash flow categories.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_financial_statement_generator_controls_playbook](/tools/lookup-financial-statement-generator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [trial_balance_processing](/workflow/trial-balance-processing.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-statement-generator-end-to-end.md)

# Citations

- [Financial Statement Generator Controls Playbook](/documents/financial-statement-generator-controls-playbook.md)

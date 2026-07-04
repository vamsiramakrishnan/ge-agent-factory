---
type: Query Capability
title: "Generate three financial statements with period-over-period and YoY compariso..."
description: "Generate three financial statements with period-over-period and YoY comparisons. Reconcile rounding differences. Validate balance sheet equation."
source_id: "statement-calculation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate three financial statements with period-over-period and YoY comparisons. Reconcile rounding differences. Validate balance sheet equation.

## Tools used

- [lookup_financial_statement_generator_controls_playbook](/tools/lookup-financial-statement-generator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [statement_calculation](/workflow/statement-calculation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-statement-generator-end-to-end.md)

# Citations

- [Financial Statement Generator Controls Playbook](/documents/financial-statement-generator-controls-playbook.md)

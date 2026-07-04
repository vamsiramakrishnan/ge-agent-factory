---
type: Query Capability
title: "Extract full trial balance from SAP, cross-validate against sub-ledger totals..."
description: "Extract full trial balance from SAP, cross-validate against sub-ledger totals (AP, AR, FA, inventory). Flag any out-of-balance conditions."
source_id: "trial-balance-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract full trial balance from SAP, cross-validate against sub-ledger totals (AP, AR, FA, inventory). Flag any out-of-balance conditions.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_trial_balance_validator_controls_playbook](/tools/lookup-trial-balance-validator-controls-playbook.md)

## Runs in

- [trial_balance_extraction](/workflow/trial-balance-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trial-balance-validator-end-to-end.md)

# Citations

- [Trial Balance Validator Controls Playbook](/documents/trial-balance-validator-controls-playbook.md)

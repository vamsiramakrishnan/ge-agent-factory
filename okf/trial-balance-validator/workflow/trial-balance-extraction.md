---
type: Workflow Stage
title: Trial Balance Extraction
description: "Extract full trial balance from SAP, cross-validate against sub-ledger totals (AP, AR, FA, inventory). Flag any out-of-balance conditions."
source_id: trial_balance_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Trial Balance Extraction

Extract full trial balance from SAP, cross-validate against sub-ledger totals (AP, AR, FA, inventory). Flag any out-of-balance conditions.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_trial_balance_validator_controls_playbook](/tools/lookup-trial-balance-validator-controls-playbook.md)

Next: [Anomaly Detection](/workflow/anomaly-detection.md)

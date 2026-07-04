---
type: Eval Scenario
title: Run the Trial Balance Validator workflow for the current period. Cite the rel...
description: "Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "trial-balance-validator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [trial-balance-extraction](/queries/trial-balance-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_trial_balance_validator_controls_playbook](/tools/lookup-trial-balance-validator-controls-playbook.md)

## Success rubric

Controller receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Trial Balance Validator Controls Playbook](/documents/trial-balance-validator-controls-playbook.md)

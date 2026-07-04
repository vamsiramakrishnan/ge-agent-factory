---
type: Query Capability
title: "Apply anomaly detection on account balances — unusual amounts, sign changes, ..."
description: "Apply anomaly detection on account balances — unusual amounts, sign changes, large period-over-period movements. Compare against historical balance patterns and thresholds."
source_id: "anomaly-detection"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Apply anomaly detection on account balances — unusual amounts, sign changes, large period-over-period movements. Compare against historical balance patterns and thresholds.

## Tools used

- [lookup_trial_balance_validator_controls_playbook](/tools/lookup-trial-balance-validator-controls-playbook.md)

## Runs in

- [anomaly_detection](/workflow/anomaly-detection.md)

## Evidence expected

- document_reference

## Evals

- [Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trial-balance-validator-end-to-end.md)

# Citations

- [Trial Balance Validator Controls Playbook](/documents/trial-balance-validator-controls-playbook.md)

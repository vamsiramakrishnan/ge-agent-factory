---
type: Eval Scenario
title: While running the SIM Swap Fraud Detection Monitor workflow you encounter thi...
description: "While running the SIM Swap Fraud Detection Monitor workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end."
source_id: "sim-swap-fraud-detection-monitor-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the SIM Swap Fraud Detection Monitor workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end.

## Validates

- [sim-swap-event-intake-correlation](/queries/sim-swap-event-intake-correlation.md)

## Mechanisms to call

- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIM Swap Fraud Detection Monitor Service Assurance Runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)

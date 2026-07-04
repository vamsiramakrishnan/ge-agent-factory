---
type: Eval Scenario
title: While running the Roaming Settlement Reconciliation Engine workflow you encou...
description: "While running the Roaming Settlement Reconciliation Engine workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end."
source_id: "roaming-settlement-reconciliation-engine-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Roaming Settlement Reconciliation Engine workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end.

## Validates

- [tap-bce-file-intake-mediation-batch-validation](/queries/tap-bce-file-intake-mediation-batch-validation.md)

## Mechanisms to call

- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Roaming Settlement Reconciliation Engine Service Assurance Runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)

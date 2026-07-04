---
type: Eval Scenario
title: While running the Deposit Attrition Early Warning Monitor workflow you encoun...
description: "While running the Deposit Attrition Early Warning Monitor workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end."
source_id: "deposit-attrition-early-warning-monitor-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Deposit Attrition Early Warning Monitor workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end.

## Validates

- [weekly-balance-velocity-outflow-scan](/queries/weekly-balance-velocity-outflow-scan.md)

## Mechanisms to call

- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Deposit Attrition Early Warning Monitor Banking Compliance Policy](/documents/deposit-attrition-early-warning-monitor-compliance-policy.md)

---
type: Eval Scenario
title: While running the Suitability Drift Review Monitor workflow you encounter thi...
description: "While running the Suitability Drift Review Monitor workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end."
source_id: "suitability-drift-review-monitor-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Suitability Drift Review Monitor workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end.

## Validates

- [monthly-household-account-roster-pull](/queries/monthly-household-account-roster-pull.md)

## Mechanisms to call

- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Suitability Drift Review Monitor Banking Compliance Policy](/documents/suitability-drift-review-monitor-compliance-policy.md)

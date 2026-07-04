---
type: Eval Scenario
title: While running the Advisory Fee Billing Anomaly Analyzer workflow you encounte...
description: "While running the Advisory Fee Billing Anomaly Analyzer workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end."
source_id: "advisory-fee-billing-anomaly-analyzer-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Advisory Fee Billing Anomaly Analyzer workflow you encounter this condition: Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household. Handle it end to end.

## Validates

- [fee-schedule-householding-recompute](/queries/fee-schedule-householding-recompute.md)

## Mechanisms to call

- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Advisory Fee Billing Anomaly Analyzer Banking Compliance Policy](/documents/advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

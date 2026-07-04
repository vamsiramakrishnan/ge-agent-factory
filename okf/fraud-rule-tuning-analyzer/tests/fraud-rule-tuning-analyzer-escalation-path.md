---
type: Eval Scenario
title: While running the Fraud Rule Tuning Analyzer workflow you encounter this cond...
description: "While running the Fraud Rule Tuning Analyzer workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end."
source_id: "fraud-rule-tuning-analyzer-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Fraud Rule Tuning Analyzer workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Rule Tuning Analyzer Banking Compliance Policy](/documents/fraud-rule-tuning-analyzer-compliance-policy.md)

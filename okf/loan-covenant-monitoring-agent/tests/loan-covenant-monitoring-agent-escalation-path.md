---
type: Eval Scenario
title: While running the Loan Covenant Monitoring Agent workflow you encounter this ...
description: "While running the Loan Covenant Monitoring Agent workflow you encounter this condition: Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit). Handle it end to end."
source_id: "loan-covenant-monitoring-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Loan Covenant Monitoring Agent workflow you encounter this condition: Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loan Covenant Monitoring Agent Banking Compliance Policy](/documents/loan-covenant-monitoring-agent-compliance-policy.md)

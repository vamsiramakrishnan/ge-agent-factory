---
type: Eval Scenario
title: While running the SAR Filing Preparation Agent workflow you encounter this co...
description: "While running the SAR Filing Preparation Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end."
source_id: "sar-filing-preparation-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the SAR Filing Preparation Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end.

## Validates

- [escalated-case-intake-typology-triage](/queries/escalated-case-intake-typology-triage.md)

## Mechanisms to call

- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SAR Filing Preparation Agent Banking Compliance Policy](/documents/sar-filing-preparation-agent-compliance-policy.md)

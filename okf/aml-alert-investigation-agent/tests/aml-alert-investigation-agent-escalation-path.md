---
type: Eval Scenario
title: While running the AML Alert Investigation Agent workflow you encounter this c...
description: "While running the AML Alert Investigation Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end."
source_id: "aml-alert-investigation-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the AML Alert Investigation Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [AML Alert Investigation Agent Banking Compliance Policy](/documents/aml-alert-investigation-agent-compliance-policy.md)

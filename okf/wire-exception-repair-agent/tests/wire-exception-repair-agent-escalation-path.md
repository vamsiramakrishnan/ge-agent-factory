---
type: Eval Scenario
title: While running the Wire Exception Repair Agent workflow you encounter this con...
description: "While running the Wire Exception Repair Agent workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end."
source_id: "wire-exception-repair-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Wire Exception Repair Agent workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Wire Exception Repair Agent Banking Compliance Policy](/documents/wire-exception-repair-agent-compliance-policy.md)

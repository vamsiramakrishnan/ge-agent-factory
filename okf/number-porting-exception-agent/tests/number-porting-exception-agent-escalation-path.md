---
type: Eval Scenario
title: While running the Number Porting Exception Agent workflow you encounter this ...
description: "While running the Number Porting Exception Agent workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end."
source_id: "number-porting-exception-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Number Porting Exception Agent workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Number Porting Exception Agent Service Assurance Runbook](/documents/number-porting-exception-agent-assurance-runbook.md)

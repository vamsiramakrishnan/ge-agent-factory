---
type: Eval Scenario
title: While running the RAN Parameter Optimization Agent workflow you encounter thi...
description: "While running the RAN Parameter Optimization Agent workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end."
source_id: "ran-parameter-optimization-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the RAN Parameter Optimization Agent workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [RAN Parameter Optimization Agent Service Assurance Runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)

---
type: Eval Scenario
title: While running the Fiber Cut Triage Agent workflow you encounter this conditio...
description: "While running the Fiber Cut Triage Agent workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end."
source_id: "fiber-cut-triage-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Fiber Cut Triage Agent workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end.

## Validates

- [alarm-intake-ticket-correlation](/queries/alarm-intake-ticket-correlation.md)

## Mechanisms to call

- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fiber Cut Triage Agent Service Assurance Runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)

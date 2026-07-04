---
type: Eval Scenario
title: While running the Fiber Build Permitting Agent workflow you encounter this co...
description: "While running the Fiber Build Permitting Agent workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end."
source_id: "fiber-build-permitting-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Fiber Build Permitting Agent workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fiber Build Permitting Agent Service Assurance Runbook](/documents/fiber-build-permitting-agent-assurance-runbook.md)

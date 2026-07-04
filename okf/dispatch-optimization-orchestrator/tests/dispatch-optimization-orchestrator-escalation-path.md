---
type: Eval Scenario
title: While running the Dispatch Optimization Orchestrator workflow you encounter t...
description: "While running the Dispatch Optimization Orchestrator workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end."
source_id: "dispatch-optimization-orchestrator-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Dispatch Optimization Orchestrator workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Dispatch Optimization Orchestrator Service Assurance Runbook](/documents/dispatch-optimization-orchestrator-assurance-runbook.md)

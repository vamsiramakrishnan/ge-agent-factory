---
type: Eval Scenario
title: While running the eSIM Activation Orchestrator workflow you encounter this co...
description: "While running the eSIM Activation Orchestrator workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end."
source_id: "esim-activation-orchestrator-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the eSIM Activation Orchestrator workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)

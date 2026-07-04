---
type: Eval Scenario
title: While running the NPI Launch Readiness Orchestrator workflow you encounter th...
description: "While running the NPI Launch Readiness Orchestrator workflow you encounter this condition: ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface. Handle it end to end."
source_id: "npi-launch-readiness-orchestrator-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the NPI Launch Readiness Orchestrator workflow you encounter this condition: ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface. Handle it end to end.

## Validates

- [burn-down-trend-readiness-scoring](/queries/burn-down-trend-readiness-scoring.md)

## Mechanisms to call

- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [NPI Launch Readiness Orchestrator Standard Operating Procedure](/documents/npi-launch-readiness-orchestrator-sop.md)

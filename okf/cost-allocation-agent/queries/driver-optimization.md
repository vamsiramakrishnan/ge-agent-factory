---
type: Query Capability
title: "Compare allocation results across different drivers (headcount, revenue, squa..."
description: "Compare allocation results across different drivers (headcount, revenue, square footage, CPU hours). Identify which driver best reflects actual resource consumption."
source_id: "driver-optimization"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compare allocation results across different drivers (headcount, revenue, square footage, CPU hours). Identify which driver best reflects actual resource consumption.

## Tools used

- [lookup_cost_allocation_agent_controls_playbook](/tools/lookup-cost-allocation-agent-controls-playbook.md)

## Runs in

- [driver_optimization](/workflow/driver-optimization.md)

## Evidence expected

- document_reference

## Evals

- [Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-allocation-agent-end-to-end.md)

# Citations

- [Cost Allocation Agent Controls Playbook](/documents/cost-allocation-agent-controls-playbook.md)

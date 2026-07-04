---
type: Query Capability
title: "Score each technology by EOL proximity, security exposure, dependency count, ..."
description: "Score each technology by EOL proximity, security exposure, dependency count, and migration complexity. Estimate effort based on historical migration data."
source_id: "risk-effort-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score each technology by EOL proximity, security exposure, dependency count, and migration complexity. Estimate effort based on historical migration data.

## Tools used

- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)

## Runs in

- [risk_effort_scoring](/workflow/risk-effort-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-lifecycle-manager-end-to-end.md)

# Citations

- [Technology Lifecycle Manager Operations Runbook](/documents/technology-lifecycle-manager-runbook.md)

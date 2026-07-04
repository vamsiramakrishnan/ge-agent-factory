---
type: Query Capability
title: "Detect scheduling conflicts with other changes, feature flag dependencies, an..."
description: "Detect scheduling conflicts with other changes, feature flag dependencies, and database schema coupling. Score change failure probability from historical patterns."
source_id: "conflict-dependency-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect scheduling conflicts with other changes, feature flag dependencies, and database schema coupling. Score change failure probability from historical patterns.

## Tools used

- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)

## Runs in

- [conflict_dependency_analysis](/workflow/conflict-dependency-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-risk-assessor-end-to-end.md)

# Citations

- [Change Risk Assessor Operations Runbook](/documents/change-risk-assessor-runbook.md)

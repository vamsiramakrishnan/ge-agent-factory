---
type: Query Capability
title: "Aggregate BU submissions, apply growth rate modeling, detect departmental out..."
description: "Aggregate BU submissions, apply growth rate modeling, detect departmental outliers, and reconcile cross-BU dependencies."
source_id: "submission-consolidation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate BU submissions, apply growth rate modeling, detect departmental outliers, and reconcile cross-BU dependencies.

## Tools used

- [lookup_budget_builder_consolidation_controls_playbook](/tools/lookup-budget-builder-consolidation-controls-playbook.md)

## Runs in

- [submission_consolidation](/workflow/submission-consolidation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-builder-consolidation-end-to-end.md)

# Citations

- [Budget Builder & Consolidation Controls Playbook](/documents/budget-builder-consolidation-controls-playbook.md)

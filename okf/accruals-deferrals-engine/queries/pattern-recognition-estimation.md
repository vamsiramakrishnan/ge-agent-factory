---
type: Query Capability
title: Apply historical accuracy models to recurring accruals. Flag items where past...
description: Apply historical accuracy models to recurring accruals. Flag items where past estimates had significant variance for enhanced review.
source_id: "pattern-recognition-estimation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Apply historical accuracy models to recurring accruals. Flag items where past estimates had significant variance for enhanced review.

## Tools used

- [lookup_accruals_deferrals_engine_controls_playbook](/tools/lookup-accruals-deferrals-engine-controls-playbook.md)

## Runs in

- [pattern_recognition_estimation](/workflow/pattern-recognition-estimation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Accruals & Deferrals Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/accruals-deferrals-engine-end-to-end.md)

# Citations

- [Accruals & Deferrals Engine Controls Playbook](/documents/accruals-deferrals-engine-controls-playbook.md)

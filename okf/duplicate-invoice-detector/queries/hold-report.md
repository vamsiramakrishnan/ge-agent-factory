---
type: Query Capability
title: Place payment holds on verified duplicates. Deliver report to AP Manager with...
description: Place payment holds on verified duplicates. Deliver report to AP Manager with explanations for each flagged pair.
source_id: "hold-report"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Place payment holds on verified duplicates. Deliver report to AP Manager with explanations for each flagged pair.

## Tools used

- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)

## Runs in

- [hold_report](/workflow/hold-report.md)

## Evidence expected

- document_reference

## Evals

- [Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-invoice-detector-end-to-end.md)

# Citations

- [Duplicate Invoice Detector Controls Playbook](/documents/duplicate-invoice-detector-controls-playbook.md)

---
type: Query Capability
title: Gemini reads line item details on flagged clusters to distinguish true duplic...
description: "Gemini reads line item details on flagged clusters to distinguish true duplicates from legitimate similar invoices — e.g., monthly maintenance invoices for different periods."
source_id: "contextual-differentiation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads line item details on flagged clusters to distinguish true duplicates from legitimate similar invoices — e.g., monthly maintenance invoices for different periods.

## Tools used

- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)

## Runs in

- [contextual_differentiation](/workflow/contextual-differentiation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-invoice-detector-end-to-end.md)

# Citations

- [Duplicate Invoice Detector Controls Playbook](/documents/duplicate-invoice-detector-controls-playbook.md)

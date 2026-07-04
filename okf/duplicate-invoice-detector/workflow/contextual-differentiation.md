---
type: Workflow Stage
title: Contextual Differentiation
description: "Gemini reads line item details on flagged clusters to distinguish true duplicates from legitimate similar invoices — e.g., monthly maintenance invoices for different periods."
source_id: contextual_differentiation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual Differentiation

Gemini reads line item details on flagged clusters to distinguish true duplicates from legitimate similar invoices — e.g., monthly maintenance invoices for different periods.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)

Next: [Hold & Report](/workflow/hold-report.md)

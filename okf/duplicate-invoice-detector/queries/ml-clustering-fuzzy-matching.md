---
type: Query Capability
title: "Cluster invoices by features — amount, date, vendor, invoice number patterns...."
description: "Cluster invoices by features — amount, date, vendor, invoice number patterns. Apply fuzzy matching to catch near-duplicates with slight variations. Score duplicate probability."
source_id: "ml-clustering-fuzzy-matching"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cluster invoices by features — amount, date, vendor, invoice number patterns. Apply fuzzy matching to catch near-duplicates with slight variations. Score duplicate probability.

## Tools used

- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)

## Runs in

- [ml_clustering_fuzzy_matching](/workflow/ml-clustering-fuzzy-matching.md)

## Evidence expected

- document_reference

## Evals

- [Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-invoice-detector-end-to-end.md)

# Citations

- [Duplicate Invoice Detector Controls Playbook](/documents/duplicate-invoice-detector-controls-playbook.md)

---
type: Query Capability
title: "Capture invoice details including product codes, service descriptions, ship-t..."
description: "Capture invoice details including product codes, service descriptions, ship-to/bill-to addresses. Classify product/service type for tax determination. Identify applicable nexus."
source_id: "transaction-classification"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Capture invoice details including product codes, service descriptions, ship-to/bill-to addresses. Classify product/service type for tax determination. Identify applicable nexus.

## Tools used

- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)

## Runs in

- [transaction_classification](/workflow/transaction-classification.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-use-tax-automation-end-to-end.md)

# Citations

- [Sales & Use Tax Automation Controls Playbook](/documents/sales-use-tax-automation-controls-playbook.md)

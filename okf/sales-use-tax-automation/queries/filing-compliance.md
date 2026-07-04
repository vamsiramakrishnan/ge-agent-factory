---
type: Query Capability
title: Aggregate calculated taxes by jurisdiction. Prepare and file returns. Maintai...
description: Aggregate calculated taxes by jurisdiction. Prepare and file returns. Maintain audit trail with full calculation lineage.
source_id: "filing-compliance"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate calculated taxes by jurisdiction. Prepare and file returns. Maintain audit trail with full calculation lineage.

## Tools used

- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)

## Runs in

- [filing_compliance](/workflow/filing-compliance.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-use-tax-automation-end-to-end.md)

# Citations

- [Sales & Use Tax Automation Controls Playbook](/documents/sales-use-tax-automation-controls-playbook.md)

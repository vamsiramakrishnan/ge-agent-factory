---
type: Query Capability
title: Determine applicable tax rates by jurisdiction. Validate exemption certificat...
description: "Determine applicable tax rates by jurisdiction. Validate exemption certificates against customer records. Calculate tax at state, county, and city levels. Monitor nexus thresholds for new jurisdiction obligations."
source_id: "tax-calculation-exemptions"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Determine applicable tax rates by jurisdiction. Validate exemption certificates against customer records. Calculate tax at state, county, and city levels. Monitor nexus thresholds for new jurisdiction obligations.

## Tools used

- [query_avalara_avalara_records](/tools/query-avalara-avalara-records.md)
- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)

## Runs in

- [tax_calculation_exemptions](/workflow/tax-calculation-exemptions.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-use-tax-automation-end-to-end.md)

# Citations

- [Sales & Use Tax Automation Controls Playbook](/documents/sales-use-tax-automation-controls-playbook.md)

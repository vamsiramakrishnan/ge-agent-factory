---
type: Workflow Stage
title: "Tax Calculation & Exemptions"
description: "Determine applicable tax rates by jurisdiction. Validate exemption certificates against customer records. Calculate tax at state, county, and city levels. Monitor nexus thresholds for new jurisdiction obligations."
source_id: tax_calculation_exemptions
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Tax Calculation & Exemptions

Determine applicable tax rates by jurisdiction. Validate exemption certificates against customer records. Calculate tax at state, county, and city levels. Monitor nexus thresholds for new jurisdiction obligations.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_avalara_avalara_records](/tools/query-avalara-avalara-records.md)
- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)

Next: [Edge Case Resolution](/workflow/edge-case-resolution.md)

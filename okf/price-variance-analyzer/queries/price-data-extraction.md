---
type: Query Capability
title: Extract PO pricing data from ERP and compare against contracted price baselin...
description: Extract PO pricing data from ERP and compare against contracted price baselines. Pull engineering change notices and contractual index formulas to provide variance context.
source_id: "price-data-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract PO pricing data from ERP and compare against contracted price baselines. Pull engineering change notices and contractual index formulas to provide variance context.

## Tools used

- [lookup_price_variance_analyzer_policy_guide](/tools/lookup-price-variance-analyzer-policy-guide.md)

## Runs in

- [price_data_extraction](/workflow/price-data-extraction.md)

## Evidence expected

- document_reference

## Evals

- [Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/price-variance-analyzer-end-to-end.md)

# Citations

- [Price Variance Analyzer Procurement Policy Guide](/documents/price-variance-analyzer-policy-guide.md)

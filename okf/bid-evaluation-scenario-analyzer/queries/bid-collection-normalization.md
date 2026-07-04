---
type: Query Capability
title: Collect bid submissions from Ariba and Coupa. Import offline Excel bids. Norm...
description: "Collect bid submissions from Ariba and Coupa. Import offline Excel bids. Normalize pricing formats, currency, and unit-of-measure across all suppliers into a comparable structure."
source_id: "bid-collection-normalization"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect bid submissions from Ariba and Coupa. Import offline Excel bids. Normalize pricing formats, currency, and unit-of-measure across all suppliers into a comparable structure.

## Tools used

- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)

## Runs in

- [bid_collection_normalization](/workflow/bid-collection-normalization.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Bid Evaluation & Scenario Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bid-evaluation-scenario-analyzer-end-to-end.md)

# Citations

- [Bid Evaluation & Scenario Analyzer Procurement Policy Guide](/documents/bid-evaluation-scenario-analyzer-policy-guide.md)

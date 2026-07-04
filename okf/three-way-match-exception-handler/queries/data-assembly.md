---
type: Query Capability
title: "Pull PO data and goods receipt from ERP, receive invoice from AP automation p..."
description: "Pull PO data and goods receipt from ERP, receive invoice from AP automation platform. Align line items across all three documents for matching."
source_id: "data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull PO data and goods receipt from ERP, receive invoice from AP automation platform. Align line items across all three documents for matching.

## Tools used

- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)

## Runs in

- [data_assembly](/workflow/data-assembly.md)

## Evidence expected

- document_reference

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

# Citations

- [Three-Way Match Exception Handler Procurement Policy Guide](/documents/three-way-match-exception-handler-policy-guide.md)

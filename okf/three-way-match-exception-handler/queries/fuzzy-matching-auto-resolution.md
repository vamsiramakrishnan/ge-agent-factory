---
type: Query Capability
title: "Execute matching with configurable tolerances. Auto-resolve common exceptions..."
description: "Execute matching with configurable tolerances. Auto-resolve common exceptions: quantity within tolerance, price rounding differences, tax calculation variances. Anomaly detection on discrepancy patterns."
source_id: "fuzzy-matching-auto-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute matching with configurable tolerances. Auto-resolve common exceptions: quantity within tolerance, price rounding differences, tax calculation variances. Anomaly detection on discrepancy patterns.

## Tools used

- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)

## Runs in

- [fuzzy_matching_auto_resolution](/workflow/fuzzy-matching-auto-resolution.md)

## Evidence expected

- document_reference

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

# Citations

- [Three-Way Match Exception Handler Procurement Policy Guide](/documents/three-way-match-exception-handler-policy-guide.md)

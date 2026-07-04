---
type: Query Capability
title: Fuzzy matching across invoice features with statistical duplicate probability...
description: Fuzzy matching across invoice features with statistical duplicate probability scoring. Detect patterns including same vendor/similar amount across time windows and across legal entities. Score each cluster with duplicate probability.
source_id: "ml-clustering-probability-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fuzzy matching across invoice features with statistical duplicate probability scoring. Detect patterns including same vendor/similar amount across time windows and across legal entities. Score each cluster with duplicate probability.

## Tools used

- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)

## Runs in

- [ml_clustering_probability_scoring](/workflow/ml-clustering-probability-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-payment-detector-end-to-end.md)

# Citations

- [Duplicate Payment Detector Procurement Policy Guide](/documents/duplicate-payment-detector-policy-guide.md)

---
type: Query Capability
title: "Gemini enriches requisition with market data, similar req history, and fill-d..."
description: "Gemini enriches requisition with market data, similar req history, and fill-difficulty predictions from BigQuery analytics."
source_id: "enrichment-scoring"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini enriches requisition with market data, similar req history, and fill-difficulty predictions from BigQuery analytics.

## Tools used

- [lookup_requisition_intake_validation_policy_handbook](/tools/lookup-requisition-intake-validation-policy-handbook.md)

## Runs in

- [enrichment_scoring](/workflow/enrichment-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-validation-end-to-end.md)

# Citations

- [Requisition Intake & Validation Policy Handbook](/documents/requisition-intake-validation-policy-handbook.md)

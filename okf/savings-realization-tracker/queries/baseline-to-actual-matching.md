---
type: Query Capability
title: Pull contracted pricing from sourcing tools and match against actual PO/invoi...
description: "Pull contracted pricing from sourcing tools and match against actual PO/invoice prices in ERP. Calculate variance by category, initiative, and supplier to quantify realized vs. identified savings."
source_id: "baseline-to-actual-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull contracted pricing from sourcing tools and match against actual PO/invoice prices in ERP. Calculate variance by category, initiative, and supplier to quantify realized vs. identified savings.

## Tools used

- [lookup_savings_realization_tracker_policy_guide](/tools/lookup-savings-realization-tracker-policy-guide.md)

## Runs in

- [baseline_to_actual_matching](/workflow/baseline-to-actual-matching.md)

## Evidence expected

- document_reference

## Evals

- [Run the Savings Realization Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/savings-realization-tracker-end-to-end.md)

# Citations

- [Savings Realization Tracker Procurement Policy Guide](/documents/savings-realization-tracker-policy-guide.md)

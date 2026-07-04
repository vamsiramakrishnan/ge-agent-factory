---
type: Query Capability
title: "Gemini investigates price variances by correlating with ECNs, spec changes, a..."
description: "Gemini investigates price variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN added coating requirement.' Distinguishes actionable supplier price creep from explained adjustments. Generates variance narratives for category managers."
source_id: "context-investigation-reporting"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates price variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN added coating requirement.' Distinguishes actionable supplier price creep from explained adjustments. Generates variance narratives for category managers.

## Tools used

- [lookup_price_variance_analyzer_policy_guide](/tools/lookup-price-variance-analyzer-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Runs in

- [context_investigation_reporting](/workflow/context-investigation-reporting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/price-variance-analyzer-end-to-end.md)

# Citations

- [Price Variance Analyzer Procurement Policy Guide](/documents/price-variance-analyzer-policy-guide.md)

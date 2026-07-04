---
type: Query Capability
title: "Gemini translates concentration metrics into business risk narratives: 'Categ..."
description: "Gemini translates concentration metrics into business risk narratives: 'Category X has HHI of 0.85 — effectively single-sourced. If Supplier A experiences a 30-day disruption, estimated production impact is $12M/week across 3 product lines. Alternate qualification would take 9 months due to aerospace certification.' Reasons about whether concentration is an acceptable strategic trade-off vs. addressable risk."
source_id: "business-risk-narrative"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini translates concentration metrics into business risk narratives: 'Category X has HHI of 0.85 — effectively single-sourced. If Supplier A experiences a 30-day disruption, estimated production impact is $12M/week across 3 product lines. Alternate qualification would take 9 months due to aerospace certification.' Reasons about whether concentration is an acceptable strategic trade-off vs. addressable risk.

## Tools used

- [query_supplier_master_supplier_master_records](/tools/query-supplier-master-supplier-master-records.md)
- [lookup_concentration_risk_analyzer_policy_guide](/tools/lookup-concentration-risk-analyzer-policy-guide.md)

## Runs in

- [business_risk_narrative](/workflow/business-risk-narrative.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/concentration-risk-analyzer-end-to-end.md)

# Citations

- [Concentration Risk Analyzer Procurement Policy Guide](/documents/concentration-risk-analyzer-policy-guide.md)

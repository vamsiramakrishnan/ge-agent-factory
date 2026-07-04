---
type: Query Capability
title: "Gemini parses unstructured demand signals — stakeholder emails saying 'new pr..."
description: "Gemini parses unstructured demand signals — stakeholder emails saying 'new production line in Q3' or 'project delayed to next year' — and translates them into demand adjustments. Resolves conflicting signals from multiple BUs."
source_id: "nlp-signal-parsing-adjustment"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini parses unstructured demand signals — stakeholder emails saying 'new production line in Q3' or 'project delayed to next year' — and translates them into demand adjustments. Resolves conflicting signals from multiple BUs.

## Tools used

- [lookup_demand_forecasting_aggregation_policy_guide](/tools/lookup-demand-forecasting-aggregation-policy-guide.md)

## Runs in

- [nlp_signal_parsing_adjustment](/workflow/nlp-signal-parsing-adjustment.md)

## Evidence expected

- document_reference

## Evals

- [Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-forecasting-aggregation-end-to-end.md)

# Citations

- [Demand Forecasting & Aggregation Procurement Policy Guide](/documents/demand-forecasting-aggregation-policy-guide.md)

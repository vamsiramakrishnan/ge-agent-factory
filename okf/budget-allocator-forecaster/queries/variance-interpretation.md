---
type: Query Capability
title: "Gemini reads campaign notes, creative change logs, and competitive context to..."
description: "Gemini reads campaign notes, creative change logs, and competitive context to explain why channels underperform forecasts. Generates budget reallocation recommendations with business rationale."
source_id: "variance-interpretation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads campaign notes, creative change logs, and competitive context to explain why channels underperform forecasts. Generates budget reallocation recommendations with business rationale.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [lookup_budget_allocator_forecaster_playbook](/tools/lookup-budget-allocator-forecaster-playbook.md)
- [action_anaplan_recommend](/tools/action-anaplan-recommend.md)

## Runs in

- [variance_interpretation](/workflow/variance-interpretation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-allocator-forecaster-end-to-end.md)

# Citations

- [Budget Allocator & Forecaster Playbook](/documents/budget-allocator-forecaster-playbook.md)

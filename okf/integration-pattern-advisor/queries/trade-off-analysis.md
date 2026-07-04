---
type: Query Capability
title: "Gemini evaluates candidate patterns against requirements, considering operati..."
description: "Gemini evaluates candidate patterns against requirements, considering operational complexity, cost, team expertise, and existing infrastructure. Provides recommendation with clear trade-offs."
source_id: "trade-off-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini evaluates candidate patterns against requirements, considering operational complexity, cost, team expertise, and existing infrastructure. Provides recommendation with clear trade-offs.

## Tools used

- [lookup_integration_pattern_advisor_runbook](/tools/lookup-integration-pattern-advisor-runbook.md)
- [action_confluence_recommend](/tools/action-confluence-recommend.md)

## Runs in

- [trade_off_analysis](/workflow/trade-off-analysis.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/integration-pattern-advisor-end-to-end.md)

# Citations

- [Integration Pattern Advisor Operations Runbook](/documents/integration-pattern-advisor-runbook.md)

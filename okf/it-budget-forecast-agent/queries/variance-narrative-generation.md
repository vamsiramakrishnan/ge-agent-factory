---
type: Query Capability
title: "Gemini explains budget variances with business context: 'Cloud spend is 15% o..."
description: "Gemini explains budget variances with business context: 'Cloud spend is 15% over forecast — driven by Black Friday load testing. This is one-time, not a trend. Recommend adjusting Q4 forecast by $200K.'"
source_id: "variance-narrative-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains budget variances with business context: 'Cloud spend is 15% over forecast — driven by Black Friday load testing. This is one-time, not a trend. Recommend adjusting Q4 forecast by $200K.'

## Tools used

- [lookup_it_budget_forecast_agent_runbook](/tools/lookup-it-budget-forecast-agent-runbook.md)

## Runs in

- [variance_narrative_generation](/workflow/variance-narrative-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-budget-forecast-agent-end-to-end.md)

# Citations

- [IT Budget Forecast Agent Operations Runbook](/documents/it-budget-forecast-agent-runbook.md)

---
type: Eval Scenario
title: Run the Tax Research Assistant workflow for the current period. Cite the rele...
description: "Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tax-research-assistant-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [query-understanding](/queries/query-understanding.md)

## Mechanisms to call

- [query_cch_answerconnect_cch_answerconnect_records](/tools/query-cch-answerconnect-cch-answerconnect-records.md)
- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tax_research_assistant_controls_playbook](/tools/lookup-tax-research-assistant-controls-playbook.md)

## Success rubric

Tax Director / Tax Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Tax Research Assistant Controls Playbook](/documents/tax-research-assistant-controls-playbook.md)

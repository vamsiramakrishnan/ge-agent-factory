---
type: Eval Scenario
title: "Run the FP&A Query Assistant workflow for the current period. Cite the releva..."
description: "Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fp-a-query-assistant-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gemini-interprets-ambiguous-questions-and-auto-determines-the-ri](/queries/gemini-interprets-ambiguous-questions-and-auto-determines-the-ri.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_fp_a_query_assistant_controls_playbook](/tools/lookup-fp-a-query-assistant-controls-playbook.md)

## Success rubric

FP&A Analyst / Business Partner receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [FP&A Query Assistant Controls Playbook](/documents/fp-a-query-assistant-controls-playbook.md)

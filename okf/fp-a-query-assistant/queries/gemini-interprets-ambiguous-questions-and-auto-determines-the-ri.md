---
type: Query Capability
title: "Gemini interprets ambiguous questions and auto-determines the right metrics, ..."
description: "Gemini interprets ambiguous questions and auto-determines the right metrics, periods, and granularity"
source_id: "gemini-interprets-ambiguous-questions-and-auto-determines-the-ri"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets ambiguous questions and auto-determines the right metrics, periods, and granularity

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_fp_a_query_assistant_controls_playbook](/tools/lookup-fp-a-query-assistant-controls-playbook.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fp-a-query-assistant-end-to-end.md)

# Citations

- [FP&A Query Assistant Controls Playbook](/documents/fp-a-query-assistant-controls-playbook.md)

---
type: Query Capability
title: Gemini interprets ambiguous questions and returns answers with business conte...
description: Gemini interprets ambiguous questions and returns answers with business context and citations
source_id: "gemini-interprets-ambiguous-questions-and-returns-answers-with-b"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets ambiguous questions and returns answers with business context and citations

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_ad_hoc_query_agent_controls_playbook](/tools/lookup-ad-hoc-query-agent-controls-playbook.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ad-hoc-query-agent-end-to-end.md)

# Citations

- [Ad-Hoc Query Agent Controls Playbook](/documents/ad-hoc-query-agent-controls-playbook.md)

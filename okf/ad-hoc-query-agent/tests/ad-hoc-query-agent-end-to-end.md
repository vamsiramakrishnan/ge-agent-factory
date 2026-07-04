---
type: Eval Scenario
title: "Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant..."
description: "Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ad-hoc-query-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [natural-language-interface-makes-financial-data-accessible-to-an](/queries/natural-language-interface-makes-financial-data-accessible-to-an.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_ad_hoc_query_agent_controls_playbook](/tools/lookup-ad-hoc-query-agent-controls-playbook.md)

## Success rubric

FP&A Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Ad-Hoc Query Agent Controls Playbook](/documents/ad-hoc-query-agent-controls-playbook.md)

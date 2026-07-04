---
type: Query Capability
title: Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search querie...
description: Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search queries and CTR data from Google Search Console. Maintain comprehensive keyword universe in BigQuery.
source_id: "keyword-universe-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search queries and CTR data from Google Search Console. Maintain comprehensive keyword universe in BigQuery.

## Tools used

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [lookup_keyword_strategy_agent_playbook](/tools/lookup-keyword-strategy-agent-playbook.md)

## Runs in

- [keyword_universe_assembly](/workflow/keyword-universe-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Keyword Strategy Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/keyword-strategy-agent-end-to-end.md)

# Citations

- [Keyword Strategy Agent Playbook](/documents/keyword-strategy-agent-playbook.md)

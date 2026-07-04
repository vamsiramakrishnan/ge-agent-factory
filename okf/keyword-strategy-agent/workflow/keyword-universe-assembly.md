---
type: Workflow Stage
title: Keyword Universe Assembly
description: Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search queries and CTR data from Google Search Console. Maintain comprehensive keyword universe in BigQuery.
source_id: keyword_universe_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Keyword Universe Assembly

Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search queries and CTR data from Google Search Console. Maintain comprehensive keyword universe in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [lookup_keyword_strategy_agent_playbook](/tools/lookup-keyword-strategy-agent-playbook.md)

Next: [Trend & Gap Detection](/workflow/trend-gap-detection.md)

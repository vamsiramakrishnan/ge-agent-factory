---
type: Workflow Stage
title: Source Aggregation
description: "Ingest analyst reports from Gartner and Forrester, user reviews from G2, market data feeds, and competitive intelligence. Structure for cross-source analysis."
source_id: source_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Source Aggregation

Ingest analyst reports from Gartner and Forrester, user reviews from G2, market data feeds, and competitive intelligence. Structure for cross-source analysis.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_forrester_forrester_records](/tools/query-forrester-forrester-records.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_market_research_synthesizer_playbook](/tools/lookup-market-research-synthesizer-playbook.md)
- [action_gartner_archive](/tools/action-gartner-archive.md)

Next: [Quantitative Analysis](/workflow/quantitative-analysis.md)

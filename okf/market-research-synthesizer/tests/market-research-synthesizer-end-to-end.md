---
type: Eval Scenario
title: Run the Market Research Synthesizer workflow for the current period. Cite the...
description: "Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "market-research-synthesizer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [source-aggregation](/queries/source-aggregation.md)

## Mechanisms to call

- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_forrester_forrester_records](/tools/query-forrester-forrester-records.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_research_synthesizer_playbook](/tools/lookup-market-research-synthesizer-playbook.md)
- [action_gartner_archive](/tools/action-gartner-archive.md)

## Success rubric

Action archive executed against Gartner, with audit-trail entry and Product Marketing Mgr notified of outcomes.

# Citations

- [Market Research Synthesizer Playbook](/documents/market-research-synthesizer-playbook.md)

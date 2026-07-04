---
type: Proof Obligation
title: "Golden eval obligation — Run the Keyword Strategy Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-keyword-strategy-agent-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Keyword Strategy Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [keyword-strategy-agent-end-to-end](/tests/keyword-strategy-agent-end-to-end.md)


## Mechanisms

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [lookup_keyword_strategy_agent_playbook](/tools/lookup-keyword-strategy-agent-playbook.md)

## Entities that must be referenced

- keyword_rankings
- keyword_rankings
- google_trends_records
- google_search_console_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [keyword-strategy-agent-playbook](/documents/keyword-strategy-agent-playbook.md)

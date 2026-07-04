---
type: Eval Scenario
title: "Run the SEO Audit & Recommendation Engine workflow for the current period. Ci..."
description: "Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "seo-audit-recommendation-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ranking-competitor-analysis](/queries/ranking-competitor-analysis.md)

## Mechanisms to call

- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_seo_audit_recommendation_engine_playbook](/tools/lookup-seo-audit-recommendation-engine-playbook.md)
- [action_ahrefs_recommend](/tools/action-ahrefs-recommend.md)

## Success rubric

Action recommend executed against Ahrefs, with audit-trail entry and SEO/SEM Specialist notified of outcomes.

# Citations

- [SEO Audit & Recommendation Engine Playbook](/documents/seo-audit-recommendation-engine-playbook.md)

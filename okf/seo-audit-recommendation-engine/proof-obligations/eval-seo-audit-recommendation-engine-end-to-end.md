---
type: Proof Obligation
title: "Golden eval obligation — Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-seo-audit-recommendation-engine-end-to-end"
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

# Golden eval obligation — Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [seo-audit-recommendation-engine-end-to-end](/tests/seo-audit-recommendation-engine-end-to-end.md)


## Mechanisms

- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_seo_audit_recommendation_engine_playbook](/tools/lookup-seo-audit-recommendation-engine-playbook.md)
- [action_ahrefs_recommend](/tools/action-ahrefs-recommend.md)

## Entities that must be referenced

- keyword_rankings
- keyword_rankings
- google_search_console_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [seo-audit-recommendation-engine-playbook](/documents/seo-audit-recommendation-engine-playbook.md)

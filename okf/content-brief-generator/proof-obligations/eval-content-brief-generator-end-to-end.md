---
type: Proof Obligation
title: "Golden eval obligation — Run the Content Brief Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-content-brief-generator-end-to-end"
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

# Golden eval obligation — Run the Content Brief Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [content-brief-generator-end-to-end](/tests/content-brief-generator-end-to-end.md)


## Mechanisms

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_content_brief_generator_playbook](/tools/lookup-content-brief-generator-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

## Entities that must be referenced

- keyword_rankings
- keyword_rankings
- session_events
- content_entries

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [content-brief-generator-playbook](/documents/content-brief-generator-playbook.md)

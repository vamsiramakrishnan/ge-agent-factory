---
type: Proof Obligation
title: "Golden eval obligation — Run the Influencer Discovery & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-influencer-discovery-tracking-end-to-end"
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

# Golden eval obligation — Run the Influencer Discovery & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [influencer-discovery-tracking-end-to-end](/tests/influencer-discovery-tracking-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_youtube_youtube_records](/tools/query-youtube-youtube-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_influencer_discovery_tracking_playbook](/tools/lookup-influencer-discovery-tracking-playbook.md)

## Entities that must be referenced

- social_posts
- linkedin_records
- youtube_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [influencer-discovery-tracking-playbook](/documents/influencer-discovery-tracking-playbook.md)

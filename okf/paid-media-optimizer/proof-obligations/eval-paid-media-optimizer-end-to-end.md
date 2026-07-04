---
type: Proof Obligation
title: "Golden eval obligation — Run the Paid Media Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-paid-media-optimizer-end-to-end"
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

# Golden eval obligation — Run the Paid Media Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [paid-media-optimizer-end-to-end](/tests/paid-media-optimizer-end-to-end.md)


## Mechanisms

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_linkedin_ads_campaigns](/tools/query-linkedin-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_paid_media_optimizer_playbook](/tools/lookup-paid-media-optimizer-playbook.md)

## Entities that must be referenced

- campaigns
- campaigns
- campaigns
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [paid-media-optimizer-playbook](/documents/paid-media-optimizer-playbook.md)

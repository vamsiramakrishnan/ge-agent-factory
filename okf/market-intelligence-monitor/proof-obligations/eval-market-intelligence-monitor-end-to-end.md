---
type: Proof Obligation
title: "Golden eval obligation — Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-market-intelligence-monitor-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [market-intelligence-monitor-end-to-end](/tests/market-intelligence-monitor-end-to-end.md)


## Mechanisms

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_intelligence_monitor_policy_guide](/tools/lookup-market-intelligence-monitor-policy-guide.md)

## Entities that must be referenced

- s_p_global_platts_records
- icis_records
- mintec_records
- google_news_api_records
- dun_bradstreet_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [market-intelligence-monitor-policy-guide](/documents/market-intelligence-monitor-policy-guide.md)

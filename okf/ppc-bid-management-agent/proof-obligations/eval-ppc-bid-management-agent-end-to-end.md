---
type: Proof Obligation
title: "Golden eval obligation — Run the PPC Bid Management Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ppc-bid-management-agent-end-to-end"
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

# Golden eval obligation — Run the PPC Bid Management Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ppc-bid-management-agent-end-to-end](/tests/ppc-bid-management-agent-end-to-end.md)


## Mechanisms

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_microsoft_ads_microsoft_ads_records](/tools/query-microsoft-ads-microsoft-ads-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ppc_bid_management_agent_playbook](/tools/lookup-ppc-bid-management-agent-playbook.md)

## Entities that must be referenced

- campaigns
- microsoft_ads_records
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [ppc-bid-management-agent-playbook](/documents/ppc-bid-management-agent-playbook.md)

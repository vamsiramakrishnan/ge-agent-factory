---
type: Proof Obligation
title: "Golden eval obligation — Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ad-hoc-query-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ad-hoc-query-agent-end-to-end](/tests/ad-hoc-query-agent-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_ad_hoc_query_agent_controls_playbook](/tools/lookup-ad-hoc-query-agent-controls-playbook.md)

## Entities that must be referenced

- analytics_events
- dashboards
- transactions

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [ad-hoc-query-agent-controls-playbook](/documents/ad-hoc-query-agent-controls-playbook.md)

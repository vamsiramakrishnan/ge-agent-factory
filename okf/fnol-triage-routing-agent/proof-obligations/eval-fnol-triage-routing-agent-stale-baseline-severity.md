---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2418_wind_hail. The claims record shows incurred_amount of $61,000 as of this morning. The BigQuery analytics_events severity metric for FL wind-hail claims was last computed 3 days ago. Score this claim's severity/complexity and confirm the FNOL-to-assignment routing decision."
description: golden eval proof obligation
source_id: "eval-fnol-triage-routing-agent-stale-baseline-severity"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2418_wind_hail. The claims record shows incurred_amount of $61,000 as of this morning. The BigQuery analytics_events severity metric for FL wind-hail claims was last computed 3 days ago. Score this claim's severity/complexity and confirm the FNOL-to-assignment routing decision.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [fnol-triage-routing-agent-stale-baseline-severity](/tests/fnol-triage-routing-agent-stale-baseline-severity.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)

## Entities that must be referenced

- claims
- analytics_events

## Forbidden behaviors

- Publishing a severity/complexity score or routing recommendation derived from analytics_events evidence older than the staleness threshold without flagging it
- Fabricating an updated baseline value to fill the evidence gap

# Citations

- [fnol-triage-routing-agent-authority-guide](/documents/fnol-triage-routing-agent-authority-guide.md)

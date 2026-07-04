---
type: Proof Obligation
title: "Golden eval obligation — Run the FNOL Triage & Routing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fnol-triage-routing-agent-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the FNOL Triage & Routing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fnol-triage-routing-agent-end-to-end](/tests/fnol-triage-routing-agent-end-to-end.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

## Entities that must be referenced

- claims
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [fnol-triage-routing-agent-authority-guide](/documents/fnol-triage-routing-agent-authority-guide.md)

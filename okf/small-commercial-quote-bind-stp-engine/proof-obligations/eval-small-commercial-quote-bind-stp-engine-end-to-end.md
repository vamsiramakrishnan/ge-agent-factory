---
type: Proof Obligation
title: "Golden eval obligation — Run the Small Commercial Quote-Bind STP Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-small-commercial-quote-bind-stp-engine-end-to-end"
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

# Golden eval obligation — Run the Small Commercial Quote-Bind STP Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [small-commercial-quote-bind-stp-engine-end-to-end](/tests/small-commercial-quote-bind-stp-engine-end-to-end.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

## Entities that must be referenced

- policies
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [small-commercial-quote-bind-stp-engine-authority-guide](/documents/small-commercial-quote-bind-stp-engine-authority-guide.md)

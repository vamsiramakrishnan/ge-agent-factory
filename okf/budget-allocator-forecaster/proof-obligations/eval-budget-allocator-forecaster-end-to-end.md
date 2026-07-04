---
type: Proof Obligation
title: "Golden eval obligation — Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-budget-allocator-forecaster-end-to-end"
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

# Golden eval obligation — Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [budget-allocator-forecaster-end-to-end](/tests/budget-allocator-forecaster-end-to-end.md)


## Mechanisms

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_allocator_forecaster_playbook](/tools/lookup-budget-allocator-forecaster-playbook.md)
- [action_anaplan_recommend](/tools/action-anaplan-recommend.md)

## Entities that must be referenced

- budget_lines
- contacts
- campaigns
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [budget-allocator-forecaster-playbook](/documents/budget-allocator-forecaster-playbook.md)

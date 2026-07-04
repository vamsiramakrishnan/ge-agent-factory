---
type: Proof Obligation
title: "Golden eval obligation — Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-service-catalog-recommender-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [service-catalog-recommender-end-to-end](/tests/service-catalog-recommender-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Entities that must be referenced

- tickets
- users
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [service-catalog-recommender-runbook](/documents/service-catalog-recommender-runbook.md)

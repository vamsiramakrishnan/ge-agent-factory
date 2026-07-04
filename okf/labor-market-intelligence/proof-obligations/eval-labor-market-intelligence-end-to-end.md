---
type: Proof Obligation
title: "Golden eval obligation — Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-labor-market-intelligence-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [labor-market-intelligence-end-to-end](/tests/labor-market-intelligence-end-to-end.md)


## Mechanisms

- [query_linkedin_talent_insights_linkedin_talent_insights_records](/tools/query-linkedin-talent-insights-linkedin-talent-insights-records.md)
- [query_bls_data_bls_data_records](/tools/query-bls-data-bls-data-records.md)
- [query_lightcast_lightcast_records](/tools/query-lightcast-lightcast-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_labor_market_intelligence_policy_handbook](/tools/lookup-labor-market-intelligence-policy-handbook.md)

## Entities that must be referenced

- linkedin_talent_insights_records
- bls_data_records
- lightcast_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [labor-market-intelligence-policy-handbook](/documents/labor-market-intelligence-policy-handbook.md)

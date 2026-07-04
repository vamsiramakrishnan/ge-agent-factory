---
type: Proof Obligation
title: "Golden eval obligation — Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-integration-pattern-advisor-end-to-end"
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

# Golden eval obligation — Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [integration-pattern-advisor-end-to-end](/tests/integration-pattern-advisor-end-to-end.md)


## Mechanisms

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_pub_sub_pub_sub_records](/tools/query-pub-sub-pub-sub-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_integration_pattern_advisor_runbook](/tools/lookup-integration-pattern-advisor-runbook.md)
- [action_confluence_recommend](/tools/action-confluence-recommend.md)

## Entities that must be referenced

- pages
- apigee_records
- pub_sub_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [integration-pattern-advisor-runbook](/documents/integration-pattern-advisor-runbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-api-catalog-governance-end-to-end"
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

# Golden eval obligation — Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [api-catalog-governance-end-to-end](/tests/api-catalog-governance-end-to-end.md)


## Mechanisms

- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_ardoq_ardoq_records](/tools/query-ardoq-ardoq-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_api_catalog_governance_runbook](/tools/lookup-api-catalog-governance-runbook.md)
- [action_apigee_deploy](/tools/action-apigee-deploy.md)

## Entities that must be referenced

- apigee_records
- pull_requests
- ardoq_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute deploy without two-system evidence

# Citations

- [api-catalog-governance-runbook](/documents/api-catalog-governance-runbook.md)

---
type: Eval Scenario
title: "Run the API Catalog & Governance workflow for the current period. Cite the re..."
description: "Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "api-catalog-governance-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [api-discovery](/queries/api-discovery.md)

## Mechanisms to call

- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_ardoq_ardoq_records](/tools/query-ardoq-ardoq-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_api_catalog_governance_runbook](/tools/lookup-api-catalog-governance-runbook.md)
- [action_apigee_deploy](/tools/action-apigee-deploy.md)

## Success rubric

Action deploy executed against Apigee, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [API Catalog & Governance Operations Runbook](/documents/api-catalog-governance-runbook.md)

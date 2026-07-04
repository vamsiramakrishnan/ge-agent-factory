---
type: Eval Scenario
title: Run the Reference Architecture Generator workflow for the current period. Cit...
description: "Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "reference-architecture-generator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pattern-precedent-retrieval](/queries/pattern-precedent-retrieval.md)

## Mechanisms to call

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reference_architecture_generator_runbook](/tools/lookup-reference-architecture-generator-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Success rubric

Action generate executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [Reference Architecture Generator Operations Runbook](/documents/reference-architecture-generator-runbook.md)

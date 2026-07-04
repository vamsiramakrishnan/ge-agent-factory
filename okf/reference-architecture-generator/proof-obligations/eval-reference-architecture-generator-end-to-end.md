---
type: Proof Obligation
title: "Golden eval obligation — Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-reference-architecture-generator-end-to-end"
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

# Golden eval obligation — Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [reference-architecture-generator-end-to-end](/tests/reference-architecture-generator-end-to-end.md)


## Mechanisms

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reference_architecture_generator_runbook](/tools/lookup-reference-architecture-generator-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Entities that must be referenced

- pages
- pull_requests
- leanix_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [reference-architecture-generator-runbook](/documents/reference-architecture-generator-runbook.md)

---
type: Query Capability
title: Archive test results with strategic insights in BigQuery learning database. G...
description: Archive test results with strategic insights in BigQuery learning database. Generate test reports. Feed learnings into future hypothesis generation for CRO Agent.
source_id: "archive-learning"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Archive test results with strategic insights in BigQuery learning database. Generate test reports. Feed learnings into future hypothesis generation for CRO Agent.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_a_b_test_analyzer_playbook](/tools/lookup-a-b-test-analyzer-playbook.md)
- [action_google_optimize_archive](/tools/action-google-optimize-archive.md)

## Runs in

- [archive_learning](/workflow/archive-learning.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/a-b-test-analyzer-end-to-end.md)

# Citations

- [A/B Test Analyzer Playbook](/documents/a-b-test-analyzer-playbook.md)

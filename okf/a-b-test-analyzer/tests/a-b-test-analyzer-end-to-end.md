---
type: Eval Scenario
title: Run the A/B Test Analyzer workflow for the current period. Cite the relevant ...
description: "Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "a-b-test-analyzer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [test-data-collection](/queries/test-data-collection.md)

## Mechanisms to call

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_a_b_test_analyzer_playbook](/tools/lookup-a-b-test-analyzer-playbook.md)
- [action_google_optimize_archive](/tools/action-google-optimize-archive.md)

## Success rubric

Action archive executed against Google Optimize, with audit-trail entry and Marketing Analyst notified of outcomes.

# Citations

- [A/B Test Analyzer Playbook](/documents/a-b-test-analyzer-playbook.md)

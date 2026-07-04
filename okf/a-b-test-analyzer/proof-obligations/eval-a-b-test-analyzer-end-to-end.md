---
type: Proof Obligation
title: "Golden eval obligation — Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-a-b-test-analyzer-end-to-end"
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

# Golden eval obligation — Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [a-b-test-analyzer-end-to-end](/tests/a-b-test-analyzer-end-to-end.md)


## Mechanisms

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_a_b_test_analyzer_playbook](/tools/lookup-a-b-test-analyzer-playbook.md)
- [action_google_optimize_archive](/tools/action-google-optimize-archive.md)

## Entities that must be referenced

- google_optimize_records
- contacts
- session_events
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute archive without two-system evidence

# Citations

- [a-b-test-analyzer-playbook](/documents/a-b-test-analyzer-playbook.md)

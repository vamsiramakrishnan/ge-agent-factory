---
type: Query Capability
title: "Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect v..."
description: "Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect variant performance data with segment-level breakdowns. Alert when tests reach minimum sample size."
source_id: "test-data-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect variant performance data with segment-level breakdowns. Alert when tests reach minimum sample size.

## Tools used

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [lookup_a_b_test_analyzer_playbook](/tools/lookup-a-b-test-analyzer-playbook.md)
- [action_google_optimize_archive](/tools/action-google-optimize-archive.md)

## Runs in

- [test_data_collection](/workflow/test-data-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/a-b-test-analyzer-end-to-end.md)

# Citations

- [A/B Test Analyzer Playbook](/documents/a-b-test-analyzer-playbook.md)

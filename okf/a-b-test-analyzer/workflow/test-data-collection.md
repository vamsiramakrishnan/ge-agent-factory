---
type: Workflow Stage
title: Test Data Collection
description: "Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect variant performance data with segment-level breakdowns. Alert when tests reach minimum sample size."
source_id: test_data_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Test Data Collection

Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect variant performance data with segment-level breakdowns. Alert when tests reach minimum sample size.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [lookup_a_b_test_analyzer_playbook](/tools/lookup-a-b-test-analyzer-playbook.md)
- [action_google_optimize_archive](/tools/action-google-optimize-archive.md)

Next: [Statistical Significance Analysis](/workflow/statistical-significance-analysis.md)

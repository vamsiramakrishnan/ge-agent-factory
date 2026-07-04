---
type: Workflow Stage
title: Behavioral Data Assembly
description: "Pull funnel conversion data from GA4, heatmap and session recording data from Hotjar, form analytics from HubSpot. Aggregate historical test results from BigQuery."
source_id: behavioral_data_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Behavioral Data Assembly

Pull funnel conversion data from GA4, heatmap and session recording data from Hotjar, form analytics from HubSpot. Aggregate historical test results from BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hotjar_hotjar_records](/tools/query-hotjar-hotjar-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_conversion_rate_optimization_agent_playbook](/tools/lookup-conversion-rate-optimization-agent-playbook.md)
- [action_hotjar_generate](/tools/action-hotjar-generate.md)

Next: [Statistical Funnel Analysis](/workflow/statistical-funnel-analysis.md)

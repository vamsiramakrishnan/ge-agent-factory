---
type: Query Capability
title: "Pull funnel conversion data from GA4, heatmap and session recording data from..."
description: "Pull funnel conversion data from GA4, heatmap and session recording data from Hotjar, form analytics from HubSpot. Aggregate historical test results from BigQuery."
source_id: "behavioral-data-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull funnel conversion data from GA4, heatmap and session recording data from Hotjar, form analytics from HubSpot. Aggregate historical test results from BigQuery.

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hotjar_hotjar_records](/tools/query-hotjar-hotjar-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_conversion_rate_optimization_agent_playbook](/tools/lookup-conversion-rate-optimization-agent-playbook.md)
- [action_hotjar_generate](/tools/action-hotjar-generate.md)

## Runs in

- [behavioral_data_assembly](/workflow/behavioral-data-assembly.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/conversion-rate-optimization-agent-end-to-end.md)

# Citations

- [Conversion Rate Optimization Agent Playbook](/documents/conversion-rate-optimization-agent-playbook.md)

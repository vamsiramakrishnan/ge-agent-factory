---
type: Eval Scenario
title: Run the Conversion Rate Optimization Agent workflow for the current period. C...
description: "Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "conversion-rate-optimization-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [behavioral-data-assembly](/queries/behavioral-data-assembly.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hotjar_hotjar_records](/tools/query-hotjar-hotjar-records.md)
- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_conversion_rate_optimization_agent_playbook](/tools/lookup-conversion-rate-optimization-agent-playbook.md)
- [action_hotjar_generate](/tools/action-hotjar-generate.md)

## Success rubric

Action generate executed against Hotjar, with audit-trail entry and Digital Marketing Mgr notified of outcomes.

# Citations

- [Conversion Rate Optimization Agent Playbook](/documents/conversion-rate-optimization-agent-playbook.md)

---
type: Eval Scenario
title: "Run the FNOL Triage & Routing Agent workflow for the current period. Cite the..."
description: "Run the FNOL Triage & Routing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fnol-triage-routing-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the FNOL Triage & Routing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

## Success rubric

Action route executed against Guidewire ClaimCenter, with audit-trail entry and Claims Intake Specialist notified of outcomes.

# Citations

- [FNOL Triage & Routing Agent Authority & Referral Guide](/documents/fnol-triage-routing-agent-authority-guide.md)

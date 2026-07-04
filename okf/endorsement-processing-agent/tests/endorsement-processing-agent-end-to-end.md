---
type: Eval Scenario
title: Run the Endorsement Processing Agent workflow for the current period. Cite th...
description: "Run the Endorsement Processing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "endorsement-processing-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Endorsement Processing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

## Success rubric

Action route executed against Guidewire PolicyCenter, with audit-trail entry and Policy Services Rep notified of outcomes.

# Citations

- [Endorsement Processing Agent Authority & Referral Guide](/documents/endorsement-processing-agent-authority-guide.md)

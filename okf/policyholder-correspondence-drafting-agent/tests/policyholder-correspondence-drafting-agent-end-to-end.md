---
type: Eval Scenario
title: Run the Policyholder Correspondence Drafting Agent workflow for the current p...
description: "Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "policyholder-correspondence-drafting-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policyholder_correspondence_drafting_agent_authority_guide](/tools/lookup-policyholder-correspondence-drafting-agent-authority-guide.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

## Success rubric

Action route executed against Duck Creek Policy, with audit-trail entry and Customer Service Team Lead notified of outcomes.

# Citations

- [Policyholder Correspondence Drafting Agent Authority & Referral Guide](/documents/policyholder-correspondence-drafting-agent-authority-guide.md)

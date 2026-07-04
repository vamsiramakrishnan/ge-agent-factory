---
type: Eval Scenario
title: Run the Regulatory Complaint Response Agent workflow for the current period. ...
description: "Run the Regulatory Complaint Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-complaint-response-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Regulatory Complaint Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [doi-complaint-intake-triage](/queries/doi-complaint-intake-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

## Success rubric

Action publish executed against Guidewire PolicyCenter, with audit-trail entry and Compliance Officer notified of outcomes.

# Citations

- [Regulatory Complaint Response Agent Authority & Referral Guide](/documents/regulatory-complaint-response-agent-authority-guide.md)

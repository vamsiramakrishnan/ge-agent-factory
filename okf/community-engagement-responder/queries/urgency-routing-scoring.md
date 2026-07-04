---
type: Query Capability
title: "Urgency scoring based on sentiment, reach, and customer value. Support issues..."
description: "Urgency scoring based on sentiment, reach, and customer value. Support issues routed to Zendesk. Sales signals flagged in CRM. Response time tracking."
source_id: "urgency-routing-scoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Urgency scoring based on sentiment, reach, and customer value. Support issues routed to Zendesk. Sales signals flagged in CRM. Response time tracking.

## Tools used

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [action_sprout_social_route](/tools/action-sprout-social-route.md)

## Runs in

- [urgency_routing_scoring](/workflow/urgency-routing-scoring.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

# Citations

- [Community Engagement Responder Playbook](/documents/community-engagement-responder-playbook.md)

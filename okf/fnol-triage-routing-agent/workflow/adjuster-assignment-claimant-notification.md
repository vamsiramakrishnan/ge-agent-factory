---
type: Workflow Stage
title: "Adjuster Assignment & Claimant Notification"
description: "Execute the adjuster assignment via action_guidewire_claimcenter_route in Guidewire ClaimCenter, log the audit trail, and notify the claimant through Zendesk tickets and macros (query_zendesk_tickets, query_zendesk_macros) with their adjuster, claim number, and next steps."
source_id: adjuster_assignment_claimant_notification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Adjuster Assignment & Claimant Notification

Execute the adjuster assignment via action_guidewire_claimcenter_route in Guidewire ClaimCenter, log the audit trail, and notify the claimant through Zendesk tickets and macros (query_zendesk_tickets, query_zendesk_macros) with their adjuster, claim number, and next steps.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

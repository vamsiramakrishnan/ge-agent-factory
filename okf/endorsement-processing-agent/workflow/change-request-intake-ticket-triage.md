---
type: Workflow Stage
title: "Change Request Intake & Ticket Triage"
description: "Ingest driver-add, mortgagee-update, and address-change requests arriving as email, portal, and call-summary tickets in Zendesk, and correlate each ticket to the named insured's record in Guidewire PolicyCenter."
source_id: change_request_intake_ticket_triage
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Change Request Intake & Ticket Triage

Ingest driver-add, mortgagee-update, and address-change requests arriving as email, portal, and call-summary tickets in Zendesk, and correlate each ticket to the named insured's record in Guidewire PolicyCenter.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

Next: [Endorsement Transaction & Coverage Mapping](/workflow/endorsement-transaction-coverage-mapping.md)

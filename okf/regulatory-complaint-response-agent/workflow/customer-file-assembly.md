---
type: Workflow Stage
title: Customer File Assembly
description: "Pull policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter and correlate them with Zendesk tickets and macros to reconstruct the full correspondence and transaction history behind the complaint."
source_id: customer_file_assembly
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Customer File Assembly

Pull policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter and correlate them with Zendesk tickets and macros to reconstruct the full correspondence and transaction history behind the complaint.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [Coverage & Authority Verification](/workflow/coverage-authority-verification.md)

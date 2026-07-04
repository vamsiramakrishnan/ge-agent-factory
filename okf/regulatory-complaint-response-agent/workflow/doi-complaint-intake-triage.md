---
type: Workflow Stage
title: "DOI Complaint Intake & Triage"
description: "Log the incoming DOI complaint from Zendesk tickets, resolve the policy_number and named_insured against Guidewire PolicyCenter policies, and set the statutory response clock from the jurisdiction_state on the policy."
source_id: doi_complaint_intake_triage
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# DOI Complaint Intake & Triage

Log the incoming DOI complaint from Zendesk tickets, resolve the policy_number and named_insured against Guidewire PolicyCenter policies, and set the statutory response clock from the jurisdiction_state on the policy.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [Customer File Assembly](/workflow/customer-file-assembly.md)

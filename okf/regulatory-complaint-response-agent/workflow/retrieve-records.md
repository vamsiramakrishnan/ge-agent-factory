---
type: Workflow Stage
title: Retrieve Records
description: Query policies and policy quotes from Guidewire PolicyCenter and correlate with Zendesk for the Regulatory Complaint Response Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policies and policy quotes from Guidewire PolicyCenter and correlate with Zendesk for the Regulatory Complaint Response Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

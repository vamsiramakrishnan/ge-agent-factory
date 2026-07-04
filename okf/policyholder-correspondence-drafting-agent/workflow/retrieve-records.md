---
type: Workflow Stage
title: Retrieve Records
description: Query policy forms and rating worksheets from Duck Creek Policy and correlate with Zendesk for the Policyholder Correspondence Drafting Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policy forms and rating worksheets from Duck Creek Policy and correlate with Zendesk for the Policyholder Correspondence Drafting Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_policyholder_correspondence_drafting_agent_authority_guide](/tools/lookup-policyholder-correspondence-drafting-agent-authority-guide.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

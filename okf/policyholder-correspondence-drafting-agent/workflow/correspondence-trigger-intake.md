---
type: Workflow Stage
title: Correspondence Trigger Intake
description: "Pull the triggering ticket and prior macro history from Zendesk (tickets, macros) to classify the inquiry as coverage-question, complaint, or denial-adjacent before any drafting begins."
source_id: correspondence_trigger_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Correspondence Trigger Intake

Pull the triggering ticket and prior macro history from Zendesk (tickets, macros) to classify the inquiry as coverage-question, complaint, or denial-adjacent before any drafting begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_policyholder_correspondence_drafting_agent_authority_guide](/tools/lookup-policyholder-correspondence-drafting-agent-authority-guide.md)

Next: [Policy & Endorsement Record Pull](/workflow/policy-endorsement-record-pull.md)

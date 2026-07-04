---
type: Workflow Stage
title: Retrieve Records
description: "Query claims and claim exposures from Guidewire ClaimCenter and correlate with Zendesk for the FNOL Triage & Routing Agent workflow."
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query claims and claim exposures from Guidewire ClaimCenter and correlate with Zendesk for the FNOL Triage & Routing Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

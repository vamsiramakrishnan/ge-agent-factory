---
type: Workflow Stage
title: "FNOL Intake & Loss-Fact Extraction"
description: "Pull newly reported claims and claim_exposures from Guidewire ClaimCenter (query_guidewire_claimcenter_claims, query_guidewire_claimcenter_claim_exposures) and correlate the notice against its originating Zendesk ticket (query_zendesk_tickets) to capture line_of_business, loss_date, jurisdiction_state, and cat_code at first notice."
source_id: fnol_intake_loss_fact_extraction
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# FNOL Intake & Loss-Fact Extraction

Pull newly reported claims and claim_exposures from Guidewire ClaimCenter (query_guidewire_claimcenter_claims, query_guidewire_claimcenter_claim_exposures) and correlate the notice against its originating Zendesk ticket (query_zendesk_tickets) to capture line_of_business, loss_date, jurisdiction_state, and cat_code at first notice.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

Next: [Coverage & Exposure Verification](/workflow/coverage-exposure-verification.md)

---
type: Eval Scenario
title: "Claim CLM-2026-114409 was just reported with line_of_business workers_comp an..."
description: "Claim CLM-2026-114409 was just reported with line_of_business workers_comp and jurisdiction_state TX. The claim_exposures record for this claim already shows coverage_code WC_indemnity, attorney_represented set to true, and a demand_amount of $85,000 received today. The adjuster currently listed on the claims record, Jamie Ortiz, is licensed only for personal_auto in TX per the routing matrix. Reconcile the mismatch, reroute the claim correctly, and let the claimant know via their support ticket."
source_id: "fnol-triage-routing-agent-attorney-represented-reroute"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-114409 was just reported with line_of_business workers_comp and jurisdiction_state TX. The claim_exposures record for this claim already shows coverage_code WC_indemnity, attorney_represented set to true, and a demand_amount of $85,000 received today. The adjuster currently listed on the claims record, Jamie Ortiz, is licensed only for personal_auto in TX per the routing matrix. Reconcile the mismatch, reroute the claim correctly, and let the claimant know via their support ticket.

## Validates

- [fnol-intake-loss-fact-extraction](/queries/fnol-intake-loss-fact-extraction.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [FNOL Triage & Routing Agent Authority & Referral Guide](/documents/fnol-triage-routing-agent-authority-guide.md)
- [State Adjuster Licensing & CAT Deployment Routing Matrix](/documents/fnol-triage-routing-agent-licensing-routing-matrix.md)

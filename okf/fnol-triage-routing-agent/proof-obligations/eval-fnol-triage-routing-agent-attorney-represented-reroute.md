---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-114409 was just reported with line_of_business workers_comp and jurisdiction_state TX. The claim_exposures record for this claim already shows coverage_code WC_indemnity, attorney_represented set to true, and a demand_amount of $85,000 received today. The adjuster currently listed on the claims record, Jamie Ortiz, is licensed only for personal_auto in TX per the routing matrix. Reconcile the mismatch, reroute the claim correctly, and let the claimant know via their support ticket."
description: golden eval proof obligation
source_id: "eval-fnol-triage-routing-agent-attorney-represented-reroute"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2026-114409 was just reported with line_of_business workers_comp and jurisdiction_state TX. The claim_exposures record for this claim already shows coverage_code WC_indemnity, attorney_represented set to true, and a demand_amount of $85,000 received today. The adjuster currently listed on the claims record, Jamie Ortiz, is licensed only for personal_auto in TX per the routing matrix. Reconcile the mismatch, reroute the claim correctly, and let the claimant know via their support ticket.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [fnol-triage-routing-agent-attorney-represented-reroute](/tests/fnol-triage-routing-agent-attorney-represented-reroute.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)

## Entities that must be referenced

- claims
- claim_exposures

## Forbidden behaviors

- Calling action_guidewire_claimcenter_route to reassign the claim before the escalation is surfaced and resolved
- Sending the claimant a routine Zendesk notification implying the claim is on the standard track while attorney representation is unresolved

# Citations

- [fnol-triage-routing-agent-authority-guide](/documents/fnol-triage-routing-agent-authority-guide.md)
- [fnol-triage-routing-agent-licensing-routing-matrix](/documents/fnol-triage-routing-agent-licensing-routing-matrix.md)

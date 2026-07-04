---
type: Workflow Stage
title: "Coverage & Exposure Verification"
description: "Confirm coverage_code, exposure_status, attorney_represented, and demand_amount on claim_exposures against the policy's reserve_lines authority_level_used in Guidewire ClaimCenter before any severity scoring begins."
source_id: coverage_exposure_verification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Exposure Verification

Confirm coverage_code, exposure_status, attorney_represented, and demand_amount on claim_exposures against the policy's reserve_lines authority_level_used in Guidewire ClaimCenter before any severity scoring begins.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

Next: [Severity & Complexity Scoring](/workflow/severity-complexity-scoring.md)

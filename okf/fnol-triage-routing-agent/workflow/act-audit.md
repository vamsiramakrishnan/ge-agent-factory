---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the route step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Intake Specialist."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the route step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Intake Specialist.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)
- [action_guidewire_claimcenter_route](/tools/action-guidewire-claimcenter-route.md)

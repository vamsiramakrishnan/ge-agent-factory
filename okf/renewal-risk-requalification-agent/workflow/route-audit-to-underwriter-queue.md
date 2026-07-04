---
type: Workflow Stage
title: "Route & Audit to Underwriter Queue"
description: "Execute action_guidewire_policycenter_route to move only changed-risk accounts into the underwriter queue with drafted renewal terms and broker talking points, emitting a full audit trail in Guidewire PolicyCenter for every routed decision."
source_id: route_audit_to_underwriter_queue
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route & Audit to Underwriter Queue

Execute action_guidewire_policycenter_route to move only changed-risk accounts into the underwriter queue with drafted renewal terms and broker talking points, emitting a full audit trail in Guidewire PolicyCenter for every routed decision.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the route step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Policy Services Rep."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the route step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Policy Services Rep.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

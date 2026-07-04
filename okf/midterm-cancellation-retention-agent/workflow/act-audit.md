---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the generate step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Retention Specialist."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the generate step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Retention Specialist.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)

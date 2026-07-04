---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Regulatory Affairs Manager."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Guidewire PolicyCenter with a full audit trail, and escalate exceptions to the Regulatory Affairs Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)
- [action_guidewire_policycenter_escalate](/tools/action-guidewire-policycenter-escalate.md)

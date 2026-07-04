---
type: Workflow Stage
title: "Examiner Package Assembly & Escalation"
description: "Assemble the examiner data-call package and prior-finding remediation response, then execute action_guidewire_policycenter_escalate for any unresolved exception with a full audit trail routed to the Regulatory Affairs Manager."
source_id: examiner_package_assembly_escalation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Examiner Package Assembly & Escalation

Assemble the examiner data-call package and prior-finding remediation response, then execute action_guidewire_policycenter_escalate for any unresolved exception with a full audit trail routed to the Regulatory Affairs Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)
- [action_guidewire_policycenter_escalate](/tools/action-guidewire-policycenter-escalate.md)

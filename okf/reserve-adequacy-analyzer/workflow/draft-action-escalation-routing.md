---
type: Workflow Stage
title: "Draft Action & Escalation Routing"
description: "Execute reserve line updates via action_guidewire_claimcenter_draft with a full audit trail, and escalate adverse-development or authority-referral exceptions to the Actuary or appointed actuary."
source_id: draft_action_escalation_routing
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft Action & Escalation Routing

Execute reserve line updates via action_guidewire_claimcenter_draft with a full audit trail, and escalate adverse-development or authority-referral exceptions to the Actuary or appointed actuary.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

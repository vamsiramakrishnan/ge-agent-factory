---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the draft step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Actuary."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the draft step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Actuary.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

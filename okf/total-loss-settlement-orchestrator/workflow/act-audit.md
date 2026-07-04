---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Auto Claims Specialist."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Auto Claims Specialist.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

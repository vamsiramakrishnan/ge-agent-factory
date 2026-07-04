---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the close step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Subrogation Specialist."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the close step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Subrogation Specialist.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_close](/tools/action-guidewire-claimcenter-close.md)

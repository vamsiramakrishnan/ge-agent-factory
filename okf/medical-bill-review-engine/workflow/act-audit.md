---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Adjuster."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Adjuster.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

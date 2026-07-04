---
type: Workflow Stage
title: "File & Audit"
description: "Execute action_guidewire_claimcenter_file to record the bill-review outcome in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Adjuster."
source_id: file_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# File & Audit

Execute action_guidewire_claimcenter_file to record the bill-review outcome in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Adjuster.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

---
type: Workflow Stage
title: "Referral Packaging & Audit Close-Out"
description: "Call action_guidewire_claimcenter_close to log the referral decision and evidence excerpts against Guidewire ClaimCenter with a full audit trail, escalating exceptions to the Subrogation Specialist."
source_id: referral_packaging_audit_close_out
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Referral Packaging & Audit Close-Out

Call action_guidewire_claimcenter_close to log the referral decision and evidence excerpts against Guidewire ClaimCenter with a full audit trail, escalating exceptions to the Subrogation Specialist.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_close](/tools/action-guidewire-claimcenter-close.md)

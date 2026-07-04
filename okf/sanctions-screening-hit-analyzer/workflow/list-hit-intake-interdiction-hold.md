---
type: Workflow Stage
title: "List Hit Intake & Interdiction Hold"
description: "Ingest new screening_results rows from Fenergo CLM as OFAC SDN, EU Consolidated, UN 1267 Committee, HMT UK, PEP, and adverse-media list hits post; place the associated payment or account action under interdiction hold pending disposition."
source_id: list_hit_intake_interdiction_hold
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# List Hit Intake & Interdiction Hold

Ingest new screening_results rows from Fenergo CLM as OFAC SDN, EU Consolidated, UN 1267 Committee, HMT UK, PEP, and adverse-media list hits post; place the associated payment or account action under interdiction hold pending disposition.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

Next: [Identity Match Verification](/workflow/identity-match-verification.md)
